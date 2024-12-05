import { Pipe, PipeTransform, inject } from '@angular/core';
import { StrapiMedia } from '../../shared/shared-types';
import { StrapiService } from '../../services/strapi.service';

@Pipe({
  name: 'strapiMedia',
  standalone: true,
})
export class StrapiMediaPipe implements PipeTransform {
  strapiSv = inject(StrapiService);
  transform(
    value?: StrapiMedia | null,
    ...args: ('thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original' | 'video')[]
  ): string {
    if(args[0] == 'video') {
      return this.strapiSv.getVideoUrl(value!);
    }
    return this.strapiSv.getImageFormatUrl(value, args[0] ?? 'large');
    //todo define default image if value is null | undefined
  }
}
