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

    const whereMap = new Map<string, Animal[]>();

    for (const animal  of animals) {
      const where = animal.status ?? "in-spaichingen";
      if(whereMap.has(where)) {
        whereMap.get(where)!.push(animal);
      } else {
        whereMap.set(where, [animal]);
      }
    }
    console.log(whereMap);
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

  filterAnimals(animals: Animal[]) {
    if(this.isVisibleFunction) {
      animals = animals.filter((animal) => this.isVisibleFunction!(animal));
    }

    const whereMap = new Map<string, Animal[]>();

    for (const animal  of animals) {
      const where = animal.status ?? "in-spaichingen";
      if(whereMap.has(where)) {
        whereMap.get(where)!.push(animal);
      } else {
        whereMap.set(where, [animal]);
      }
    }
    console.log(whereMap);

    return whereMap;
  }

  ngOnInit() {
    this.animals$ = this.query$.pipe(
      debounceTime(300),
      switchMap(query => this.animalSv.getAnimalList(query).pipe(
        tap(() => this.loaded.emit())
      ))
    );
  }
}
