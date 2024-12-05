import { Pipe, PipeTransform } from '@angular/core';
import markdownit from 'markdown-it'

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {

  md = markdownit();

  transform(value: string, ...args: unknown[]): unknown {
    return this.md.render(value);
  }

}
