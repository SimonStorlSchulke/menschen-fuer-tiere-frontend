import { Component, inject } from '@angular/core';
import { AnimalService } from '../services/animal.service';
import { AsyncPipe } from '@angular/common';
import { StrapiRichTextPipe } from "../article/article-sections/strapi-rich-text.pipe";
import { StrapiMediaComponent } from "../shared/strapi-media/strapi-media.component";

@Component({
  selector: 'app-home-found',
  imports: [AsyncPipe, StrapiRichTextPipe, StrapiMediaComponent],
  templateUrl: './home-found.component.html',
  styleUrl: './home-found.component.scss'
})
export class HomeFoundComponent {
  animals$ = inject(AnimalService).getHomeFoundAnimals();
}
