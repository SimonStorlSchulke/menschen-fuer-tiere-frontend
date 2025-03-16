import { Component, DestroyRef, Input, OnInit, inject, Output, EventEmitter, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { AnimalTileComponent } from '../animal-tile/animal-tile.component';
import { Animal } from '../shared-types';
import {BehaviorSubject, debounceTime, Observable, switchMap, tap} from 'rxjs';

@Pipe({
  name: 'filterAnimals',
  standalone: true,
})
export class FitlerAnimalsPipe implements PipeTransform {
  transform(value: {animals: Animal[], isVisibleFunction?: (animal: Animal) => boolean}): Map<string, Animal[]> {

    let animals: Animal[] = [];
    if(value.isVisibleFunction) {
      animals = value.animals.filter((animal) => value.isVisibleFunction!(animal));
    }

    const whereMap = new Map<string, Animal[]>([]);

    for (const animal  of animals) {
      const where = animal.status ?? "in-spaichingen";
      if(whereMap.has(where)) {
        whereMap.get(where)!.push(animal);
      } else {
        whereMap.set(where, [animal]);
      }
    }
    return whereMap;
  }
}

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [AsyncPipe, AnimalTileComponent, FitlerAnimalsPipe],
  templateUrl: './animal-list.component.html',
  styleUrl: './animal-list.component.scss'
})
export class AnimalListComponent implements OnInit {
  protected animalSv = inject(AnimalService);

  @Input() query$ = new BehaviorSubject<string>("");
  @Input() isVisibleFunction?: (animal: Animal) => boolean;

  @Output() loaded = new EventEmitter<void>();

  protected animals$?: Observable<Animal[]>;
  @Input() animalKind!: string;

  ngOnInit() {
    this.animals$ = this.query$.pipe(
      debounceTime(300),
      switchMap(query => this.animalSv.getAnimalList(query).pipe(
        tap(() => {
          console.log(query)
          this.loaded.emit()
        })
      ))
    );
  }

  whereEntryName(whereEntryKey: string) {
    return new Map<string, string>([
      ["in-spaichingen", "In Spaichingen"],
      ["in-rumänien", "In Rumänien"],
    ]).get(whereEntryKey);
  }

  whereEntryExplainer(whereEntryKeyAndAnimal: string) {
    return new Map<string, string>([
      ["Hunde-in-spaichingen", "Hier sind unsere bellenden Fellnasen, die ein neues Zuhause suchen. Doch bevor Sie sich einen Hund anschaffen, sollten Sie sich ausreichend informieren."],
      ["Hunde-vermisst", "Hier sind unsere bellenden Fellnasen, die ein neues Zuhause suchen. Doch bevor Sie sich einen Hund anschaffen, sollten Sie sich ausreichend informieren. Hier finden Sie wichtige Informationen über den Hund."],
      ["Hunde-in-rumänien", "Die Hunde befinden sich nicht bei uns sondern sind in Rumänien von unserem Partnerverein Metanoia Tiernothilfe. Einer dieser Hunde in Rumänien hat Ihr Interesse geweckt? Melden Sie sich gerne bei uns im Tierheim. Die Einreise und Vermittlung findet direkt über uns statt. 🐾"],
      ["Katzen-in-spaichingen", "Hier sind unsere Miniaturtiger, die ein neues Zuhause suchen. Doch bevor Sie sich eine Katze anschaffen, sollten Sie sich ausreichend informieren. Uns ist es besonders wichtig, dass die süßen Miezen in liebevollen und verantwortungsvollen Händen landen. Deshalb werden alle Katzen nur nach einer positiven Vorkontrolle in ihr neues Zuhause vermittelt. Kitten und Jungkatzen vermitteln wir ausschließlich zu zweit, denn nichts ist schöner für ein Katzenkind, als gemeinsam mit einem Spielgefährten die Welt zu erkunden. ❤️ 🔍🤝"],
      ["vermisst-vermisst", "Auf dieser Seite sehen Sie die vermissten Tiere. Wenn Sie Ihr Tier vermissen, wenden Sie sich an uns. Wenn Sie eines der Tiere von dieser Seite gesehen haben, wenden Sie sich bitte umgehend an das Tierheim. Hier kommen Sie zu unserer <a href='/kontakt'>Kontaktseite</a>."],
      ["fundtier-fundtier", "Auf dieser Seite sehen Sie die uns zugelaufenen Tiere. Wenn Sie eines der Tiere erkennen, wenden Sie sich an uns. Hier kommen Sie zu unserer <a href='/kontakt'>Kontaktseite</a>"],
    ]).get(whereEntryKeyAndAnimal);
  }
}
