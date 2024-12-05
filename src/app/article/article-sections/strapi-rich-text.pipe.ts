import { Pipe, PipeTransform } from '@angular/core';
import {
  RichTextNode,
  renderStrapiRichText,
} from '../../services/blockRenderer';

@Pipe({
  name: 'strapiRichText',
  standalone: true,
})
export class StrapiRichTextPipe implements PipeTransform {
  transform(value: RichTextNode[], ...args: unknown[]): unknown {
    return renderStrapiRichText(value);
  }
}
