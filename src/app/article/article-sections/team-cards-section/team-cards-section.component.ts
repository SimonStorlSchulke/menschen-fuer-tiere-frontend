import { Component, Input, OnInit, inject } from '@angular/core';
import { Animal } from '../../../shared/shared-types';
import { Observable, map } from 'rxjs';
import { AnimalTileComponent  } from '../../../shared/animal-tile/animal-tile.component';
import { AsyncPipe } from '@angular/common';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { RichTextNode } from '../../../services/blockRenderer';
import { AnimalService } from '../../../services/animal.service';

export type ArticleAnimalCardsSection = {
  __component: 'article-section.animal-cards';
  text: RichTextNode[];
  background?: "nein" | "grün" | "beige";
  animals: Animal[];
  filteredAmount?: number,
};

@Component({
    selector: 'app-animal-cards-section',
    imports: [AnimalTileComponent, AsyncPipe, StrapiRichTextPipe],
    templateUrl: './team-cards-section.component.html',
    styleUrl: './team-cards-section.component.scss',
  standalone: true,
})
export class TeamCardsSectionComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleAnimalCardsSection;

  animals$?: Observable<Animal[]>;

  animalSv = inject(AnimalService);

  ngOnInit() {
    const animalIds = this.sectionData.animals.map(a => a.id);

    let query = "?populate=thumbnail";
    for (let i = 0; i < animalIds.length; i++) {
      query += `&filters[id][$in][${i}]=${animalIds[i]}`
    }

    this.animals$ = this.animalSv.get<Animal[]>("animals" + query)
      .pipe(map(unsortedAnimalsList => {
        let sortedAnimals: Animal[] = [];

        for (const id of animalIds) {
          const matchingAnimal = unsortedAnimalsList.find(a => a.id == id);
          if(matchingAnimal) {
            sortedAnimals.push(matchingAnimal)
          }
        }

        const dogNumToAdd = (this.sectionData.filteredAmount ?? 0) - sortedAnimals.length;

        if(dogNumToAdd > 0) {
          this.addNextAnimals(sortedAnimals, dogNumToAdd);
        }

        return sortedAnimals;
       }));
  }

  private addNextAnimals(animalsAlreadyInList: Animal[], num: number) {
    for (const a of this.animalSv.allAnimalsData) {
      if(animalsAlreadyInList.findIndex(an => an.id == a.id) == -1) {
        animalsAlreadyInList.push(a);
        num--;
      }
      if(num < 1) break;
    }
  }

}
