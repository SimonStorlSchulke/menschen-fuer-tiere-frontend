import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { AnimalArticle } from '../../../services/animal-article.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent } from '../../../article/article.component';
import { StrapiMediaPipe } from "../../../article/article-sections/strapi-image.pipe";
import { AnimalService } from '../../../services/animal.service';
import { Title } from '@angular/platform-browser';
import { Animal } from '../../../shared/shared-types';


@Component({
  selector: 'app-animal-article-print',
  templateUrl: './animal-article-print.component.html',
  styleUrl: './animal-article-print.component.scss',
  imports: [
    ArticleComponent,
    StrapiMediaPipe,
    RouterLink,
    NgIf,
  ]
})
export class AnimalArticlePrintComponent {
  animalSv = inject(AnimalService);
  titleSv = inject(Title);

  article?: AnimalArticle;

  selectedCv: number = 0;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
      .subscribe(({ animalArticle }) => {
        if(!animalArticle) {
          inject(Router).navigate(["404"]);
          return;
        }
        this.article = animalArticle;
        this.selectedCv = this.article!.preselectedAnimalId;
        this.titleSv.setTitle(`${this.getDefaultTitle()} | Menschen für Tiere e.V. Spaichingen`);
      });
  }

  getDefaultTitle(): string {
    if(this.article?.title) return this.article.title;
    const names = this.article?.animals.map(animal => animal.name) ?? [];
    if (names.length == 1) {
      return names[0];
    }
    if (names.length == 2) {
      return `${names[0]} & ${names[1]}`;
    }
    return names.slice(0, -1).join(", ") + ` & ${names[names.length - 1]}`;
  }

  getCtoText() {
    const names = this.article?.animals.map(animal => animal.name) ?? [];
    if (names.length == 1) {
      return `Hat ${names[0]} dein Interesse geweckt?`;
    }
    if (names.length == 2) {
      return `Haben ${names[0]} & ${names[1]} dein Interesse geweckt?`;
    }
    return `Hat einer der Hunde dein Interesse geweckt?`;
  }

  isAdult() {
    const age = this.animalSv.yearsOld(this.article!.animals[this.selectedCv]) ?? 1;
    return age > 1;
  }

  getGendericon(animal: Animal) {
    return animal.gender == "male" ? "assets/img/male.svg" : "assets/img/female.svg";
  }
}
