import { Component, Input } from '@angular/core';
import { StrapiMedia } from '../../../shared/shared-types';
import { StrapiMediaPipe } from "../../../article/article-sections/strapi-image.pipe";

export type TeamMember = {
  name: string,
  role: string,
  description: string,
  mail: string,
  phone: string,
  image?: StrapiMedia,
}

@Component({
    selector: 'app-teammember-tile',
    standalone: true,
    templateUrl: './teammember-tile.component.html',
    styleUrl: './teammember-tile.component.scss',
    imports: [StrapiMediaPipe]
})
export class TeammemberTileComponent {
  @Input({required: true}) teamMember!: TeamMember;
}
