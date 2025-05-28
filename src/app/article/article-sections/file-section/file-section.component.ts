import { Component, Input } from '@angular/core';
import { StrapiService } from '../../../services/strapi.service';

export type FileSection = {
  __component: 'article-section.file';
  background?: "nein" | "grün" | "beige";
  Datei: {
    url: string,
    name: string,
    size: number,
    ext: string,
  };
};

@Component({
    selector: 'app-file-section',
    imports: [],
    templateUrl: './file-section.component.html',
    styleUrl: './file-section.component.scss'
})
export class FileSectionComponent {
  @Input({required: true}) sectionData!: FileSection;

  baseUrl = StrapiService.uploadsBaseUrl;

  ngOnInit() {
    console.log(this.sectionData.Datei)
  }
}
