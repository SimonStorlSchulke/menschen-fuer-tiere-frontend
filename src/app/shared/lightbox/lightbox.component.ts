import {ChangeDetectorRef, Component, ElementRef, HostListener, inject, Input, OnInit, ViewChild} from '@angular/core';
import { LightboxService } from '../../services/lightbox.service';
import { StrapiMediaPipe } from '../../article/article-sections/strapi-image.pipe';
import { StrapiService } from '../../services/strapi.service';
import { StrapiMedia } from '../shared-types';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-lightbox',
    imports: [StrapiMediaPipe],
    templateUrl: './lightbox.component.html',
    styleUrl: './lightbox.component.scss',
  standalone: true,
})
export class LightboxComponent implements OnInit {
  @ViewChild("modal") dialogRef!: ElementRef<HTMLDialogElement>;


  lightboxSv = inject(LightboxService);
  strapiSv = inject(StrapiService);
  cdRef = inject(ChangeDetectorRef);

  userUnputHappeded = false;

  @Input() images: StrapiMedia[] = [];
  @Input() currentSource: string = "";
  @Input() startSrcs: string[] = [];
  @Input() fullscreen = false;

  currentIndex = 0;

  constructor() {
    interval(5000).pipe(takeUntilDestroyed()).subscribe(() => {
      if(this.userUnputHappeded) return;
        this.to(this.currentIndex + 1);
        this.cdRef.markForCheck();
      });
  }

  ngOnInit() {
    if(!this.fullscreen) {
      this.to(0);
    } else {
      this.lightboxSv.open$.subscribe((data) => {
        this.startSrcs = data.startImgSrcs;
        this.currentIndex = data.startIndex;
        this.images = data.images;
        this.currentSource = data.startImgSrcs[this.currentIndex];
        window.setTimeout(() => {
          this.dialogRef.nativeElement.showModal();
          this.currentSource = this.getSrc();
        }, 0
        )
      })
    }


  }

  getSrc(): string {
    const strapiImg = this.images![this.currentIndex];
    return this.strapiSv.getImageFormatUrl(strapiImg, this.fullscreen ? "xlarge" : "medium");
  }

  getFullscreenStartingSources() {
    return this.strapiSv.getImageFormatUrls(this.images, "medium");
  }

  toFromUi(index: number) {
    this.userUnputHappeded = true;
    this.to(index);
  }

  to(index: number) {
    if(this.dialogRef?.nativeElement && !this.dialogRef.nativeElement.open) return;
    const imgMaxIndex = this.images!.length - 1;
    if(index > imgMaxIndex) {
      this.currentIndex = 0
    } else if(index < 0) {
      this.currentIndex = imgMaxIndex;
    } else {
      this.currentIndex = index;
    }
    this.currentSource = this.startSrcs[this.currentIndex];
     if(this.fullscreen) {
      window.setTimeout(() => {
        this.currentSource = this.getSrc();
      }, 0
      )
    } else {
      this.currentSource = this.getSrc();
    }
   }

  @HostListener('click', ['$event'])
  closeOnClick(e: MouseEvent) {
    if(e.target instanceof HTMLElement && e.target.classList.contains("closable")) {
      this.dialogRef.nativeElement.close();
    }
  }


  @HostListener('window:keydown.ArrowLeft', ['$event'])
  prev() {
    this.to(this.currentIndex - 1);
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  next() {
    this.to(this.currentIndex + 1);
  }

  get multiImageMode() {
    return (this.images?.length ?? 0) > 1;
  }
}
