import { Component, Input } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { StrapiMediaPipe } from '../strapi-image.pipe';
import { StrapiMedia } from '../../../shared/shared-types';

export type ArticleHeroSection = {
  __component: 'article-section.hero';
  background?: "nein" | "grün" | "beige";
  hero: StrapiMedia;
};

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [StrapiRichTextPipe, StrapiMediaPipe],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  @Input({required: true}) sectionData!: ArticleHeroSection;
}