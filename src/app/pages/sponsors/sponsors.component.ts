import { Component, inject } from '@angular/core';
import { ResolveFn, ActivatedRoute } from '@angular/router';
import { AnimalArticleService } from '../../services/animal-article.service';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StrapiMedia } from '../../shared/shared-types';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';

export type SponsorsData = {
  sponsors: { name: string, description?: string, icon: StrapiMedia }[],
  article: ArticleSection[],
  article2: ArticleSection[],
}

export const sponsorsResolver: ResolveFn<SponsorsData> = () => {
  return inject(AnimalArticleService).getAndInsertAnimalLinks<SponsorsData>("sponsor?populate[article][populate]=*&populate[sponsors][populate]=*");
}

@Component({
  selector: 'app-sponsors',
  imports: [
    ArticleComponent,
    StrapiMediaPipe
  ],
  templateUrl: './sponsors.component.html',
  styleUrl: './sponsors.component.scss',
  standalone: true,
})
export class SponsorsComponent {

  pageData!: SponsorsData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
      .subscribe( ({ pageData }) => {
          this.pageData = pageData;
        }
      );
  }
}
