import { Component, Input } from '@angular/core';
import { StrapiMedia } from '../shared-types';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [StrapiMediaPipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  @Input({required: true}) images!: StrapiMedia[]
}
