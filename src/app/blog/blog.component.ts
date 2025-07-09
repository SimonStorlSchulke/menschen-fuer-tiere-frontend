import { Component, inject } from '@angular/core';
import { StrapiMedia } from '../shared/shared-types';
import { ArticleSection, ArticleComponent } from '../article/article.component';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveFn, RouterLink } from '@angular/router';
import { AnimalArticleService } from '../services/animal-article.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

export type BlogArticle = {
  id: number,
  title: string,
  type: string,
  thumbnail?: StrapiMedia,
  description: string,
  artikel: ArticleSection[], //todo rename in strapi
  publishedAt: string,
  showAsPopup?: boolean,
  priority: number,
  updatedAt: string,
}


export const blogArticleResolver: ResolveFn<BlogArticle>  = (
  route: ActivatedRouteSnapshot,
) => {
  const id = route.paramMap.get('id')!;  //todo null savety
  return inject(AnimalArticleService).getBlogArticle(+id);
}


@Component({
    selector: 'app-blog',
    imports: [ArticleComponent, RouterLink, DatePipe],
    templateUrl: './blog.component.html',
    styleUrl: './blog.component.scss'
})
export class BlogComponent {

  article?: BlogArticle;

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ articleData }) => {
      console.log(articleData)
        this.article = articleData;
      }
    );
  }
}
