import { Component, Input } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { CountUpModule } from 'ngx-countup';

export type ArticleCounterSection = {
  __component: 'article-section.counter';
  background?: "nein" | "grün" | "beige";
  title: string;
  subtitle: string;
  counter: number;
};

@Component({
    selector: 'app-counter-section',
    imports: [StrapiRichTextPipe, CountUpModule],
    templateUrl: './counter-section.component.html',
    styleUrl: './counter-section.component.scss',
  standalone: true,
})
export class CounterSectionComponent {
  @Input({ required: true }) sectionData!: ArticleCounterSection;
}
