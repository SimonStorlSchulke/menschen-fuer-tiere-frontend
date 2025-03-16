import { Component, inject } from '@angular/core';
import { ActivatedRoute, ResolveFn } from '@angular/router';
import { StrapiService, StrapiPagination } from '../../services/strapi.service';
import { StrapiMedia } from '../../shared/shared-types';
import { HeroComponent } from '../../shared/hero/hero.component';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { BlogArticle } from '../../blog/blog.component';
import { BlogTileComponent } from '../../blog/blog-tile/blog-tile.component';
import { AnimalArticleService } from '../../services/animal-article.service';

const pageSize = 10;

export const newsResolver: ResolveFn<NewsData> = () => {
  return forkJoin({
    pageData: inject(AnimalArticleService).getAndInsertAnimalLinks<NewsData>("news-page?populate[hero]=*&populate[article][populate]=*"),
    newsData: inject(StrapiService).getWithMeta<BlogArticle[], {pagination: StrapiPagination}>("blogs?sort[1]=publishedAt:desc&populate[thumbnail]=*&pagination[page]=1&pagination[pageSize]=" + pageSize),
  }).pipe(map(data => {
    data.pageData.news = data.newsData[0];
    data.pageData.pagination = data.newsData[1].pagination;
    return data.pageData;
  }))
}


export type NewsData = {
  hero?: StrapiMedia,
  article: ArticleSection[],
  news?: BlogArticle[],
  pagination: StrapiPagination,
}

@Component({
    selector: 'app-knowledge',
    imports: [HeroComponent, ArticleComponent, BlogTileComponent],
    templateUrl: './knowledge.component.html',
    styleUrl: './knowledge.component.scss'
})
export class KnowledgeComponent {
  pageData!: NewsData;
  activeFilter = "";
  activePage = 1;

  strapiSv = inject(StrapiService);

  constructor() {
    inject(ActivatedRoute).data.pipe(takeUntilDestroyed())
    .subscribe( ({ newsData }) => {
        this.pageData = newsData;
        this.toggleFilter("wissen", 0)
      }
    );
  }

  toggleFilter(filterKey: string, pageNumber: number) {
    if(filterKey != "") {
      const previousFilter = this.activeFilter;
      if(previousFilter == "") {
        this.activeFilter = filterKey;
      } else if (previousFilter == filterKey) {
        this.activeFilter = ""
      } else {
        this.activeFilter = filterKey;
      }
    }
    let filterQuery = "";
    if(this.activeFilter != "") {
      filterQuery += "&filters[type]=" + this.activeFilter;
    }

    this.activePage = pageNumber;

    lastValueFrom(this.strapiSv.getWithMeta<BlogArticle[], {pagination: StrapiPagination}>("blogs?populate[thumbnail]=*" + filterQuery + this.getPaginationQuery(this.activePage)))
      .then(news => {
        this.pageData.news = news[0];
        this.pageData.pagination = news[1].pagination;
        if(filterKey == "") {
          this.scrollToAnchor();
        }
      });

  }

  showAll() {
    this.activeFilter = "";
    lastValueFrom(this.strapiSv.getWithMeta<BlogArticle[], {pagination: StrapiPagination}>("blogs?populate[thumbnail]=*" + this.getPaginationQuery(0)))
      .then(news => {
        this.pageData.news = news[0];
        this.pageData.pagination = news[1].pagination;
      });
  }

  isFilterActive(filterKey: string) {
    return this.activeFilter == filterKey;
  }

  private getPaginationQuery(page: number): string {
    return `&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  }

  private scrollToAnchor() {
    window.scrollTo({
      behavior: 'smooth',
      top:
        document.querySelector(".scroll-anchor")!.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        100,
    })
  }
}
