import { Component, Input, inject } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiMediaPipe } from '../strapi-image.pipe';
import { GalleryModule } from 'ng-gallery';
import { StrapiService } from '../../../services/strapi.service';
import { RichTextNode } from '../../../services/blockRenderer';
import { StrapiMedia } from '../../../shared/shared-types';
import { StrapiMediaComponent } from '../../../shared/strapi-media/strapi-media.component';

export type ArticleTextWithImageSection = {
  __component: 'article-section.text-with-image-section';
  background?: "nein" | "grün" | "beige";
  text: RichTextNode[];
  images?: StrapiMedia[];
  imagePosition: 'oben' | 'rechts' | 'links' | 'unten';
  gallery: boolean;
};

@Component({
    selector: 'app-text-image-section',
    imports: [StrapiRichTextPipe, StrapiMediaPipe, GalleryModule, StrapiMediaComponent],
    templateUrl: './text-image-section.component.html',
    styleUrl: './text-image-section.component.scss',
  standalone: true,
})
export class TextImageSectionComponent {
  @Input({ required: true }) sectionData!: ArticleTextWithImageSection;
  strapiSv = inject(StrapiService);
}
