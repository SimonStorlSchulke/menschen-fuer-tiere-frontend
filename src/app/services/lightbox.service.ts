import { Injectable } from '@angular/core';
import { StrapiMedia } from '../shared/shared-types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LightboxService {

  open$ = new Subject<{images: StrapiMedia[], startImgSrcs: string[], startIndex: number}>();

  openFullscreen(images: StrapiMedia[], startIndex: number, startImgSrcs: string[] = []) {
    this.open$.next({images, startImgSrcs, startIndex});
  }

}
