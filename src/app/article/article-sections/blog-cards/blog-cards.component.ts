import { Component, Input, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BlogArticle } from '../../../blog/blog.component';
import { Observable } from 'rxjs';
import { StrapiService } from '../../../services/strapi.service';
import { BlogTileComponent } from '../../../blog/blog-tile/blog-tile.component';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

export type ArticleBlogCardsSection = {
  __component: 'article-section.news-cards';
  background?: "nein" | "grün" | "beige";
  amount: number,
  type: string,
};


@Component({
    selector: 'app-blog-cards',
    imports: [BlogTileComponent, AsyncPipe],
    templateUrl: './blog-cards.component.html',
    styleUrl: './blog-cards.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCardsComponent {
  @Input({required: true}) sectionData!: ArticleBlogCardsSection;

  blogs$?: Observable<BlogArticle[]>;

  strapiSv = inject(StrapiService);

  //TODO this is horrible.
  constructor(cdRef: ChangeDetectorRef) {
    inject(ActivatedRoute).url.subscribe((url) => {
          if(!url[0]?.path) return;
          const blogtype = url[0]?.path == "wissenswertes" ? "wissen" : "news"
          this.blogs$ = this.strapiSv.get<BlogArticle[]>(`blogs?sort[1]=publishedAt:desc&populate[thumbnail]=*&filters[type]=${blogtype}&pagination[pageSize]=${50}`);
        }
      )
  }


}
