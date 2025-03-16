import { Injectable, inject } from '@angular/core';
import { StrapiService } from './strapi.service';
import { map, Observable } from 'rxjs';
import { DefaultPageData } from '../pages/default-page/default-page.component';
import { ResolveFn, ActivatedRouteSnapshot, Route } from '@angular/router';
import { AnimalArticleService } from './animal-article.service';

export type StrapiDynamicRoute = {
  name: string;
  url: string;
  createNavigationMenuEntry: boolean;
}

type StrapiRoute = {
  name: string;
  path: string,
  children: StrapiRoute[];
};

type RouteHierarchy = {
  [key: string]: RouteHierarchy | { name: string } | null;
};

const pageResolver: ResolveFn<DefaultPageData> = (
  route: ActivatedRouteSnapshot,
) => {
  const sitePath = "/" + route.url.join("/")!;
  const apiPath = `pages?filters[url][$eq]=${sitePath}&populate[article][populate]=*`;

  return inject(AnimalArticleService)
    .getAndInsertAnimalLinks<DefaultPageData[]>(apiPath)
    .pipe(map(article =>  article[0]));
};

@Injectable({
  providedIn: 'root'
})
export class SitemapService {

  strapiService = inject(StrapiService);

  getSitemap(): Observable<RouteHierarchy> {
    return this.strapiService.get<StrapiDynamicRoute[]>("pages").pipe(map(r => this.buildRouteHierarchy(r)))
  }

  private buildRouteHierarchy(strapiRoutes: StrapiDynamicRoute[]): RouteHierarchy {
    const hierarchy: RouteHierarchy = {};

    strapiRoutes.forEach(({ url, name }) => {
      url = url ?? "";
      const parts = url.split("/");

      if (parts.length > 2) {
        throw new Error(`Invalid route format: "${url}". Routes can only have up to two parts.`);
      }

      const [part1, part2] = parts;

      if (!hierarchy[part1]) {
        hierarchy[part1] = part2 ? {} : { name };
      } else if (!part2 && typeof hierarchy[part1] === "object" && !("title" in (hierarchy[part1] as any))) {
        hierarchy[part1] = { ...hierarchy[part1], name };
      }

      if (part2) {
        if (hierarchy[part1] === null) {
          hierarchy[part1] = {};
        }
        (hierarchy[part1] as RouteHierarchy)[part2] = { name };
      }
    });
    console.log(hierarchy);
    return hierarchy;
  }
}
