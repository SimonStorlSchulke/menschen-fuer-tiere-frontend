import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { StrapiMedia } from '../../shared/shared-types';
import { AnimalArticleService } from '../../services/animal-article.service';


export type AboutData = {
  hero: StrapiMedia,
  article: ArticleSection[],
}

export const aboutResolver: ResolveFn<AboutData> = () => {
  return inject(AnimalArticleService).getAndInsertAnimalLinks<AboutData>("about-page?populate[hero]=*&populate[article][populate]=*");
}

@Component({
    selector: 'app-about',
    imports: [HeroComponent, ArticleComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
  aboutData!: AboutData;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ aboutData }) => {
        this.aboutData = aboutData;
      }
    );
  }
}
