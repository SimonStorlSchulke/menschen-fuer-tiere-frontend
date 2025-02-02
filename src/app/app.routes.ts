import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import {
  AnimalArticleComponent,
  animalArticleResolver,
} from './pages/animal-article/animal-article.component';
import { AnimalsComponent, animalsResolver } from './pages/dogs/animals.component';
import { AboutComponent, aboutResolver } from './pages/about/about.component';
import { NewsComponent, newsResolver } from './pages/news/news.component';
import {
  ContactComponent,
  contactResolver,
} from './pages/contact/contact.component';
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


const pageResolver: ResolveFn<DefaultPageData> = (
  route: ActivatedRouteSnapshot,
) => {
  const sitePath = route.url.join("/")!;

  let apiPath: string;

  if(sitePath == "") {
    apiPath = `pages?filters[path][$null]=true&populate[article][populate]=*`
  } else {
    apiPath = `pages?filters[path][$eq]=${sitePath}&populate[article][populate]=*`;
  }

  return inject(AnimalArticleService)
    .getAndInsertAnimalLinks<DefaultPageData[]>(apiPath)
    .pipe(map(article =>  article[0]));
};


export const routes: Routes = [
  {
    path: 'ueber-uns',
    component: AboutComponent,
    data: { title: 'Über uns' },
    resolve: { aboutData: aboutResolver },
  },
  {
    path: 'tiere',
    component: AnimalsComponent,
    data: { title: 'Tiere' },
    resolve: {animalKindsData: animalsResolver },
  },
  {
    path: 'tiere/:animalKind',
    component: AnimalsComponent,
    data: { title: 'Tiere' },
    resolve: {animalKindsData: animalsResolver },
  },
  {
    path: 'tierartikel/:name',
    component: AnimalArticleComponent,
    data: { title: 'dynamic' },
    resolve: { animalArticle: animalArticleResolver },
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
  { path: '**', component: DefaultPageComponent, resolve: { pageData: pageResolver } },
  { path: 'formulare/bewerbung', component: ApplyComponent },
];
