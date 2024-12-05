import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { StrapiMedia } from '../../shared/shared-types';
import { AnimalArticleService } from '../../services/animal-article.service';


export type ConveyData = {
  hero: StrapiMedia,
  article: ArticleSection[],
}

export const conveyResolver: ResolveFn<ConveyData> = () => {
  return inject(AnimalArticleService).getAndInsertAnimalLinks<ConveyData>("convey?populate[hero]=*&populate[article][populate]=*");
}

@Component({
  selector: 'app-convey',
  standalone: true,
  imports: [HeroComponent, ArticleComponent],
  templateUrl: './convey.component.html',
  styleUrl: './convey.component.scss'
})
export class ConveyComponent {
  conveyData!: ConveyData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ conveyData }) =>  this.conveyData = conveyData);
  }
}
