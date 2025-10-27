import {Component, computed, input, Input} from '@angular/core';

export type ButtonLinkSection = {
  __component: 'article-section.button-link';
  background?: "nein" | "grün" | "beige";
  text: string;
  link: string;
  type: 'primary' | 'secondary' | 'call-to-action';
};

@Component({
    selector: 'app-button-link-section',
    imports: [],
    templateUrl: './button-link-section.component.html',
    styleUrl: './button-link-section.component.scss'
})
export class ButtonLinkSectionComponent {
  sectionData = input.required<ButtonLinkSection>();

  isExternalLink = computed(() =>
    this.sectionData().link.startsWith('http')
    && !this.sectionData().link.includes('menschen-fuer-tiere-spaichingen.de')
  );
}
