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
  category: "ehrenamtlich" | "vorstand" | "tierheim",
}

@Component({
    selector: 'app-teammember-tile',
    templateUrl: './teammember-tile.component.html',
    styleUrl: './teammember-tile.component.scss',
    imports: [StrapiMediaPipe],
  standalone: true,
})
export class TeammemberTileComponent {
  @Input({required: true}) teamMember!: TeamMember;
}
