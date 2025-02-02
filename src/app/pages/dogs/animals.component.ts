import { Component, ElementRef, inject, ViewChild} from '@angular/core';
import { AnimalService } from '../../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { Animal, AnimalKind } from '../../shared/shared-types';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { AnimalListComponent } from '../../shared/animal-list/animal-list.component';
import { BehaviorSubject, lastValueFrom, map, Observable, switchMap, tap } from 'rxjs';
import { AnimalArticleService } from '../../services/animal-article.service';
import {DogsService} from "./dogs.service";
import { ActivatedRoute, ResolveFn, RouterLink, RouterLinkActive } from '@angular/router';
import { StrapiService } from '../../services/strapi.service';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';

export const animalsResolver: ResolveFn<AnimalKindsData> = async (route) => {
  return {
    currentAnimalKind: route.paramMap.get("animalKind")  ?? "tiere",
    animalKinds: await lastValueFrom(inject(StrapiService).get("animal-kinds?populate=icon")),
  }
}

export type AnimalKindsData = {
  currentAnimalKind: string,
  animalKinds: AnimalKind[],
}

export type AnimalsPageData = {
  article?: ArticleSection[];
  animalKindsData: AnimalKindsData,
}

@Component({
  selector: 'app-dogs',
  standalone: true,
  imports: [AsyncPipe, AnimalListComponent, ArticleComponent, RouterLink, StrapiMediaPipe, RouterLinkActive],
  templateUrl: './animals.component.html',
  styleUrl: './animals.component.scss',
})
export class AnimalsComponent {

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  animalSv = inject(AnimalService);
  animalArticleSv = inject(AnimalArticleService);
  dogsSv = inject(DogsService);

  query$ = new BehaviorSubject<string>('');

  pageContent$: Observable<AnimalsPageData> = inject(ActivatedRoute).data.pipe(
    switchMap(data => {
      const animalKindsData: AnimalKindsData = data["animalKindsData"];
      const url = `animal-kinds?filters[namePlural][$eqi]=${animalKindsData.currentAnimalKind}&populate=*`
      const dynamicPage$ = this.animalArticleSv
        .getAndInsertAnimalLinks<AnimalKind[]>(url);

      return dynamicPage$.pipe(
        map(dynamicPageData => ({
          animalKindsData,
          article: dynamicPageData[0]?.article ?? [],
        }))
      );
    })
  );


  toggleFilter(category: string, key: string) {
    [...this.dogsSv.filters.get(category)!.keys()].forEach((cKey) => {
      if (cKey != key) {
        this.dogsSv.filters.get(category)!.set(cKey, false);
      }
    });
    const oldValue = this.dogsSv.filters.get(category)!.get(key)!;
    this.dogsSv.filters.get(category)!.set(key, !oldValue);
    if (this.query$.value != '') {
      this.query$.next('');
    }
    this.searchInput.nativeElement.value = "";
  }

  resetFilters() {
    for (const category of this.dogsSv.filters.keys()) {
      for (const key of this.dogsSv.filters.get(category)!.keys()) {
        this.dogsSv.filters.get(category)!.set(key, false)
      }
    }
  }

  onSearchTyped(e: string) {
    if (e.length > 1) {
      this.query$.next(`filters[$or][0][name][$contains]=${e}&filters[$or][1][description][$contains]=${e}`);
      window.setTimeout(() => {
        this.resetFilters();
      }, 400);
    } else {
      this.query$.next('');
    }
  }

  isFilterActive(category: string, key: string) {
    return this.dogsSv.filters.get(category)!.get(key);
  }

  activeFilter(category: string) {
    for (const key of this.dogsSv.filters.get(category)!.keys()) {
      if (this.dogsSv.filters.get(category)?.get(key)) return key;
    }
    return null;
  }


  getIsVisibleFunction(): (animal: Animal) => boolean {
    return (animal: Animal) => {

      let fitsSize = !this.activeFilter('size');
      if (animal.shoulderHeightCm) {
        if (this.isFilterActive('size', 'small') && animal.shoulderHeightCm <= 40) fitsSize = true;
        if (this.isFilterActive('size', 'medium') && animal.shoulderHeightCm > 40 && animal.shoulderHeightCm <= 55) fitsSize = true;
        if (this.isFilterActive('size', 'large') && animal.shoulderHeightCm > 55) fitsSize = true;
      }

      let fitsGender = !this.activeFilter('gender');
      if (this.isFilterActive('gender', 'male') && animal.gender == 'male') fitsGender = true;
      if (this.isFilterActive('gender', 'female') && animal.gender == 'female') fitsGender = true;


      let fitsAge = !this.activeFilter('age');
      if (animal.birthday) {
        const yearsOld = this.animalSv.yearsOld(animal)!;
        if (this.isFilterActive('age', 'young') && yearsOld < 1) fitsAge = true;
        if (this.isFilterActive('age', 'medium') && yearsOld >= 1 && yearsOld < 7) fitsAge = true;
        if (this.isFilterActive('age', 'old') && yearsOld >= 7) fitsAge = true;
      }

      return fitsSize && fitsGender && fitsAge;
    };
  }

  getExplainer() {
    const sizeTexts = new Map<string, string>([
      ["small", "mit bis zu 30cm Schulterhöhe"],
      ["medium", "mit 30-55cm Schulterhöhe"],
      ["large", "ab 55cm Schulterhöhe"],
    ]);

    const ageTexts = new Map<string, string>([
      ["young", "im Alter bis zu 12 Monaten"],
      ["medium", "im Alter von 1-6 Jahren"],
      ["old", "ab 7 Jahren"],
    ]);

    const gender = this.activeFilter("gender");
    const genderText = gender ? (gender == "male" ? "Rüden" : "Hündinnen") : "Hunde";
    const sizeText = sizeTexts.get(this.activeFilter("size") ?? "") ?? "";
    const ageText = ageTexts.get(this.activeFilter("age") ?? "") ?? "";

    const text = [genderText, sizeText, ageText].join(" ");
    if(text.trim() == "Hunde") return "";
    return text;
  }
}
