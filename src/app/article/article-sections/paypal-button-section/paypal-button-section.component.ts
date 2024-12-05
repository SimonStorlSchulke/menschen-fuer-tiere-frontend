import { Component, Input } from '@angular/core';
import { StrapiRichTextPipe } from '../strapi-rich-text.pipe';
import { CountUpModule } from 'ngx-countup';

export type ArticlePaypalButtonSection = {
  __component: 'article-section.paypal-button';
  background?: "nein" | "grün" | "beige";
};

@Component({
  selector: 'app-paypal-button-section',
  standalone: true,
  imports: [StrapiRichTextPipe, CountUpModule],
  templateUrl: './paypal-button-section.component.html',
  styleUrl: './paypal-button-section.component.scss',
})
export class PaypalButtonSectionComponent {
  @Input({ required: true }) sectionData!: ArticlePaypalButtonSection;
}
