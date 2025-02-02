import { Component, Input } from '@angular/core';
import { BlogArticle } from '../blog.component';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-blog-tile',
    imports: [StrapiMediaPipe, DatePipe, RouterLink],
    templateUrl: './blog-tile.component.html',
    styleUrl: './blog-tile.component.scss'
})
export class BlogTileComponent {
  @Input({required: true}) blog!: BlogArticle;

}
