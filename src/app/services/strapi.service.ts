import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { StrapiFilter, StrapiMedia } from "../shared/shared-types";

let showDrafts = false;

@Injectable({
  providedIn: "root",
})
export class StrapiService {
  //This api key  offers read-only-access to the cms and is supposed to be public, so it's fine to put it here hardcoded.

  static bearer =
    "a54b3bdc5772ebdacff1a1b5b8176b6011421634344e42e42252b7895882016ad16cf0c5ecb4b1b8cef5cb4fd840e12e4d7cfe8d00571f070be27bc831c2f5d3ab9ba3b048d6cad8ff9070055d748b2409745b302119664d7d97b366aafe0a39486c090f1ddb1101d2c3e050874f0e97c6f25b60cfb80e8ec9d38775106e2289";

  static apiBaseUrl = "https://cms.sheltify.de/api/";
  static uploadsBaseUrl = "https://cms.sheltify.de";

  static readonly headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${StrapiService.bearer}`,
  };

  httpClient = inject(HttpClient);

  enableDrafts() {
    showDrafts = true;
  }

  get<T>(path: string): Observable<T> {
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url, {
        headers: StrapiService.headers,
      })
      .pipe(map((obj) => flattenStrapiObject(obj)));
  }

  getWithMeta<DataT, MetaT>(path: string): Observable<[DataT, MetaT]> {
    let url = decodeURIComponent(StrapiService.apiBaseUrl + path);
    url = this.addDraftsInDevMode(url);
    return this.httpClient
      .get(url, {
        headers: StrapiService.headers,
      })
      .pipe(
        map((obj) => {
          const meta = (obj as any)["meta"];
          return [flattenStrapiObject(obj), meta];
        }),
      );
  }

  get isDevEnv(): boolean {
    return (
      window.location.origin.includes("//dev.") ||
      window.location.origin.includes(":4200")
    );
  }

  getAsString(path: string, filters: StrapiFilter[] = []): Observable<string> {
    let params = new URLSearchParams();

    for (const filter of filters) {
      params.append(
        `filters[${filter.field}][$${filter.operator ?? "eq"}]`,
        filter.value,
      );
    }
    let url =
      StrapiService.apiBaseUrl +
      path +
      (path.includes("?") ? "&" : "?") +
      params.toString();
    url = this.addDraftsInDevMode(url);

    return this.httpClient
      .get(decodeURIComponent(url), { headers: StrapiService.headers })
      .pipe(map((obj) => JSON.stringify(flattenStrapiObject(obj))));
  }

  getVideoUrl(media: StrapiMedia) {
    return StrapiService.uploadsBaseUrl + media.url;
  }

  getImageFormatUrl(
    image: StrapiMedia | null | undefined,
    size: "thumbnail" | "small" | "medium" | "large" | "xlarge" | "original",
  ): string {
    if (image == null) {
      return "";
    }

    if (!image.formats) {
      return image.url;
    }

    let toReturn = "";

    switch (size) {
      case "thumbnail":
        toReturn = image.formats.thumbnail.url;
        break;
      case "small":
        toReturn =
          image.formats.small?.url ??
          image.url;
        break;
      case "medium":
        toReturn =
          image.formats.medium?.url ??
          image.url;
        break;
      case "large":
        toReturn =
          image.formats.large?.url ??
          image.url;
        break;
      case "xlarge":
        toReturn =
          image.formats.xlarge?.url ??
          image.url;
        break;
      case "original":
        toReturn = image.url;
        break;
    }

    return StrapiService.uploadsBaseUrl + toReturn;
  }

  getImageFormatUrls(
    images: StrapiMedia[],
    size: "thumbnail" | "small" | "medium" | "large" | "xlarge" | "original",
  ) {
    return images.map((img) => this.getImageFormatUrl(img, size));
  }

  addDraftsInDevMode(url: string): string {
    if (!showDrafts) return url;
    return url + (url.includes("?") ? "&" : "?") + "publicationState=preview";
  }
}

function flattenStrapiObject(data: any) {
  const isObject = (data: any) =>
    Object.prototype.toString.call(data) === "[object Object]";
  const isArray = (data: any) =>
    Object.prototype.toString.call(data) === "[object Array]";

  function flatten(data: any) {
    if (!data.attributes) return data;

    return {
      id: data.id,
      ...data.attributes,
    };
  }

  if (isArray(data)) {
    return data.map((item: any) => flattenStrapiObject(item));
  }

  if (isObject(data)) {
    if (isArray(data.data)) {
      data = [...data.data];
    } else if (isObject(data.data)) {
      data = flatten({ ...data.data });
    } else if (data.data === null) {
      data = null;
    } else {
      data = flatten(data);
    }

    for (const key in data) {
      data[key] = flattenStrapiObject(data[key]);
    }

    return data;
  }

  return data;
}

export type StrapiPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};
