import { Component, Input } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { RichTextNode } from '../../../services/blockRenderer';

export type ArticleTextSection = {
  __component: 'article-section.text';
  background?: "nein" | "grün" | "beige";
  text: RichTextNode[];
};

@Component({
  selector: 'app-text-section',
  standalone: true,
  imports: [StrapiRichTextPipe],
  templateUrl: './text-section.component.html',
  styleUrl: './text-section.component.scss',
})
export class TextSectionComponent {
  @Input({ required: true }) sectionData!: ArticleTextSection;
}
