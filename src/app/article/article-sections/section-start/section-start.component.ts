import { Component, Input } from '@angular/core';

export type SectionStartSection = {
  __component: 'article-section.section-start';
  title?: string;
  background?: "nein" | "grün" | "beige";
};

@Component({
    selector: 'app-section-start',
    imports: [],
    templateUrl: './section-start.component.html',
    styleUrl: './section-start.component.scss'
})
export class SectionStartComponent {
  @Input({required: true}) sectionData!: SectionStartSection;
}
