import { Component, Input, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BlogArticle } from '../../../blog/blog.component';
import { Observable } from 'rxjs';
import { StrapiService } from '../../../services/strapi.service';
import { BlogTileComponent } from '../../../blog/blog-tile/blog-tile.component';
import { AsyncPipe } from '@angular/common';

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
export class BlogCardsComponent implements OnInit {
  @Input({required: true}) sectionData!: ArticleBlogCardsSection;

  blogs$?: Observable<BlogArticle[]>;

  strapiSv = inject(StrapiService);

  ngOnInit() {
    setTimeout(() => {
    console.log(this.sectionData.type)
    this.blogs$ = this.strapiSv.get<BlogArticle[]>(`blogs?sort[1]=publishedAt:desc&populate[thumbnail]=*&filters[type]=${this.sectionData.type}&pagination[pageSize]=${this.sectionData.amount}`);
    }, 10)
  }

}
