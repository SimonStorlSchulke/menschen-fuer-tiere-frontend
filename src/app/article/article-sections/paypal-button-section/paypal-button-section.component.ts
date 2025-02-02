import { Component, Input } from '@angular/core';
import { CountUpModule } from 'ngx-countup';

export type ArticlePaypalButtonSection = {
  __component: 'article-section.paypal-button';
  background?: "nein" | "grün" | "beige";
};

@Component({
    selector: 'app-paypal-button-section',
    imports: [CountUpModule],
    templateUrl: './paypal-button-section.component.html',
    styleUrl: './paypal-button-section.component.scss'
})
export class PaypalButtonSectionComponent {
  @Input({ required: true }) sectionData!: ArticlePaypalButtonSection;
}
