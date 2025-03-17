import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';
import {
  AnimalArticleComponent,
  animalArticleResolver,
} from './pages/animal-article/animal-article.component';
import { AnimalsComponent, animalsResolver } from './pages/dogs/animals.component';
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
import { SponsorsComponent, sponsorsResolver } from './pages/sponsors/sponsors.component';


const pageResolver: ResolveFn<DefaultPageData> = (
  route: ActivatedRouteSnapshot,
) => {
  const sitePath = route.url.join("/")!;

  let apiPath: string;

  if(sitePath == "") {
    apiPath = `pages?filters[url][$null]=true&populate[article][populate]=*`
  } else {
    apiPath = `pages?filters[url][$eq]=${sitePath}&populate[article][populate]=*`;
  }

  return inject(AnimalArticleService)
    .getAndInsertAnimalLinks<DefaultPageData[]>(apiPath)
    .pipe(map(article =>  article[0]));
};


export const routes: Routes = [
/*  {
    path: 'ueber-uns',
    component: AboutComponent,
    data: { title: 'Über uns' },
    resolve: { aboutData: aboutResolver },
  },*/
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
/*  {
    path: 'veranstaltungen',
    component: NewsComponent,
    data: { title: 'Veranstaltungen' },
    resolve: { newsData: newsResolver },
  },
  {
    path: 'wissenswertes',
    component: KnowledgeComponent,
    data: { title: 'Wissenswertes' },
    resolve: { newsData: newsResolver },
  },*/
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
  {
    path: 'sponsoren',
    component: SponsorsComponent,
    data: { title: 'Sponsoren' },
    resolve: { pageData: sponsorsResolver },
  },
  { path: 'impressum', component: ImprintComponent },
  { path: 'dsgvo', component: DsgvoComponent },
  { path: 'formulare/bewerbung', component: ApplyComponent },
  { path: '**', component: DefaultPageComponent, resolve: { pageData: pageResolver } },
];
