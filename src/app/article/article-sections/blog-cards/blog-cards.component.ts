import { Component, Input, inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BlogArticle } from '../../../blog/blog.component';
import { map, Observable, tap } from 'rxjs';
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
    inject(ActivatedRoute).url.pipe(tap((console.log))).subscribe((url) => {
          let blogtype = url[0]?.path == "wissenswertes" ? "wissen" : "news"
           const filters = (!url[0]?.path) ? "&filters[type][$ne]=wissen" : `&filters[type]=${blogtype}`;
          this.blogs$ = this.strapiSv.get<BlogArticle[]>(`blogs?sort[1]=publishedAt:desc&populate[thumbnail]=*${filters}&pagination[pageSize]=${50}`)
            .pipe(
              map(blogs => {
                const allBlogs = blogs.sort((a, b) => {
                  if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                  }
                  const dateA = new Date(a.updatedAt ?? "2000-01-01").getTime();
                  const dateB = new Date(b?.updatedAt ?? "2000-01-01").getTime();
                  return dateB - dateA;
                });
                return allBlogs.splice(0, this.sectionData.amount);
              })
            );
        }
      )
  }


}
