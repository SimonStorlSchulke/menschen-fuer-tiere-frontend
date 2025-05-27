import { Component, inject, Input } from '@angular/core';
import { GalleryModule } from 'ng-gallery';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';
import { StrapiRichTextPipe } from '../../article/article-sections/strapi-rich-text.pipe';
import { LightboxService } from '../../services/lightbox.service';
import { StrapiService } from '../../services/strapi.service';
import { StrapiMedia } from '../shared-types';
import { LightboxComponent } from '../lightbox/lightbox.component';

@Component({
    selector: 'app-strapi-media',
    imports: [StrapiMediaPipe, GalleryModule, LightboxComponent],
    templateUrl: './strapi-media.component.html',
    styleUrl: './strapi-media.component.scss',
    standalone: true,
})
export class StrapiMediaComponent {
  @Input({required: true}) media?: StrapiMedia[] = [];
  @Input() asGallery: boolean = true;
  @Input() thumbnail: boolean = false;
  @Input() imagePosition: string = "solo";
  strapiSv = inject(StrapiService);
  lightboxSv = inject(LightboxService);
}
