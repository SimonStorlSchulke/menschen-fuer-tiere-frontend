import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import {
  AnimalArticleComponent,
  animalArticleResolver,
} from './pages/animal-article/animal-article.component';
import { DogsComponent } from './pages/dogs/dogs.component';
import { HomeComponent, homeResolver } from './pages/home/home.component';
import { AboutComponent, aboutResolver } from './pages/about/about.component';
import { NewsComponent, newsResolver } from './pages/news/news.component';
import { HelpComponent, helpResolver } from './pages/help/help.component';
import {
  ContactComponent,
  contactResolver,
} from './pages/contact/contact.component';
import {
  ConveyComponent,
  conveyResolver,
} from './pages/convey/convey.component';
import { ApplyComponent } from './pages/forms/apply/apply.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { blogArticleResolver, BlogComponent } from './blog/blog.component';
import { AnimalArticleService } from './services/animal-article.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import {
  DefaultPageComponent,
  DefaultPageData,
} from './pages/default-page/default-page.component';
import { DsgvoComponent } from './pages/dsgvo/dsgvo.component';
import { NotFoundComponent } from './pages/404/404.component';

function getSubPageResolver(collectionNamePlural: string) {
  const resolver: ResolveFn<DefaultPageData> = (
    route: ActivatedRouteSnapshot,
  ) => {
    const urlName = route.paramMap.get('urlName')!; //todo null savety
    const path = `${collectionNamePlural}?filters[urlName][$eq]=${urlName}&populate[article][populate]=*`;
    return inject(AnimalArticleService)
      .getAndInsertAnimalLinks<DefaultPageData[]>(path)
      .pipe(
        map((article) => {
          return article[0];
        }),
      );
  };
  return resolver;
}
export const routes: Routes = [
  { path: '', component: HomeComponent, resolve: { homeData: homeResolver } },
  {
    path: 'ueber-uns',
    component: AboutComponent,
    data: { title: 'Über uns' },
    resolve: { aboutData: aboutResolver },
  },
  {
    path: 'vermittlung/:urlName',
    component: DefaultPageComponent,
    data: { title: 'Vermittlung' },
    resolve: { pageData: getSubPageResolver('convey-subpages') },
  },
  {
    path: 'vermittlung',
    component: ConveyComponent,
    data: { title: 'Vermittlung' },
    resolve: { conveyData: conveyResolver },
  },
  {
    path: 'helfen',
    component: HelpComponent,
    data: { title: 'Helfen' },
    resolve: { helpData: helpResolver },
  },
  {
    path: 'helfen/:urlName',
    component: DefaultPageComponent,
    resolve: { pageData: getSubPageResolver('help-subpages') },
  },
  {
    path: 'tiere/hunde',
    component: DogsComponent,
    data: { title: 'Hunde' },
  },
  {
    path: 'news',
    component: NewsComponent,
    data: { title: 'News & Wissen' },
    resolve: { newsData: newsResolver },
  },
  {
    path: 'news/:id',
    component: BlogComponent,
    data: { title: 'News & Wissen' },
    resolve: { articleData: blogArticleResolver },
  },
  {
    path: 'kontakt',
    component: ContactComponent,
    data: { title: 'Kontakt' },
    resolve: { contactData: contactResolver },
  },
  { path: 'impressum', component: ImprintComponent },
  { path: 'dsgvo', component: DsgvoComponent },
  {
    path: 'tierartikel/:name',
    component: AnimalArticleComponent,
    data: { title: 'dynamic' },
    resolve: { animalArticle: animalArticleResolver },
  },
  { path: 'formulare/bewerbung', component: ApplyComponent },
  { path: '**', pathMatch: "full", component:  NotFoundComponent},
];
