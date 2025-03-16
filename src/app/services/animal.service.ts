import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StrapiService } from './strapi.service';
import { Animal } from '../shared/shared-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AnimalService extends StrapiService {


  allAnimalsData: Animal[] = [];
  private destroyRef = inject(DestroyRef);

  updateAllAnimalsData() {
    this.getAnimalList().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(animals => this.allAnimalsData = animals);
  }

  /** returns list of animals from the given filters as query. Ordered by priority and modification date of the animals article */
  getAnimalList(filters: string = ''): Observable<Animal[]> {
    let url = `animals?pagination[pageSize]=500&populate[thumbnail]=*&populate[animal_article]=updatedAt&${filters}`;
    return this.get<Animal[]>(url).pipe(
      map(animals => animals
        .filter(a => a.animal_article)
        .sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        const dateA = new Date(a.animal_article?.updatedAt ?? "2000-01-01").getTime();
        const dateB = new Date(b.animal_article?.updatedAt ?? "2000-01-01").getTime();
        return dateB - dateA;
      }))
    );
  }



  getAgeString(animal: Animal): string {
    if (!animal.birthday) return 'Unbekannt';
    const birthDate = new Date(animal.birthday);
    const today = new Date();
    let months: number = this.monthDiff(birthDate, today);

    if (months < 12) {
      return `ca. ${months} Monate`;
    }

    const yearsRounded = Math.round((months / 12) * 2) / 2;
    const yearsString = yearsRounded.toString().replace('.5', ' 1/2');
    return yearsString == '1'
      ? `ca. ${yearsString} Jahr`
      : `ca. ${yearsString} Jahre`;
  }

  private monthDiff(d1: Date, d2: Date): number {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  public yearsOld(animal: Animal): number | null {
    if(!animal.birthday) return null;
    const birthDate = new Date(animal.birthday);
    let months: number = this.monthDiff(birthDate, new Date());
    return months / 12;
  }

  public isInGermany(animal: Animal) {
    return (animal.whereInGermany ?? "").trim() != "";
  }
}
