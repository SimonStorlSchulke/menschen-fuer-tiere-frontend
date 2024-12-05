import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewChildren, HostListener } from '@angular/core';
import { ArticleTextSection, TextSectionComponent } from './article-sections/text-section/text-section.component';
import { ArticleTextWithImageSection, TextImageSectionComponent } from './article-sections/text-image-section/text-image-section.component';
import { ArticleHeroSection, HeroSectionComponent } from './article-sections/hero-section/hero-section.component';
import { ArticleImageSection, ImageSectionComponent } from './article-sections/image-section/image-section.component';
import { AnimalCardsSectionComponent, ArticleAnimalCardsSection } from './article-sections/animal-cards-section/animal-cards-section.component';
import { ButtonLinkSection, ButtonLinkSectionComponent } from './article-sections/button-link-section/button-link-section.component';
import { SectionStartComponent, SectionStartSection } from './article-sections/section-start/section-start.component';
import { ArticleBlogCardsSection, BlogCardsComponent } from './article-sections/blog-cards/blog-cards.component';
import { ArticleCounterSection, CounterSectionComponent } from './article-sections/counter-section/counter-section.component';
import { ArticlePaypalButtonSection, PaypalButtonSectionComponent } from './article-sections/paypal-button-section/paypal-button-section.component';
import { Subject, throttleTime } from 'rxjs';

export type ArticleSection =
  | ArticleTextSection
  | ArticleTextWithImageSection
  | ArticleHeroSection
  | ArticleAnimalCardsSection
  | ArticleRowStartSection
  | ArticleBlogCardsSection
  | ButtonLinkSection
  | ArticleImageSection
  | SectionStartSection
  | ArticlePaypalButtonSection
  | ArticleCounterSection;



export type ArticleRowStartSection = {
  __component: 'article-section.row-start';
  title: string;
  background?: "nein" | "grün" | "beige";
  columns: number;
  textCentered: boolean;
};

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    TextSectionComponent,
    TextImageSectionComponent,
    HeroSectionComponent,
    ImageSectionComponent,
    AnimalCardsSectionComponent,
    ButtonLinkSectionComponent,
    SectionStartComponent,
    BlogCardsComponent,
    CounterSectionComponent,
    PaypalButtonSectionComponent,
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements AfterViewInit {
  @Input({ required: true }) sections!: ArticleSection[];
  @ViewChild("article") articleElement!: ElementRef;

  @ViewChildren("sectionContainer") sectionContainers!: ElementRef<HTMLElement>[];

  animate$ = new Subject<void>();

  constructor() {
  }
  
  ngAfterViewInit() {
    const rowStartTags = (this.articleElement.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.article-rows');
    rowStartTags.forEach((rowStart) => {
      const columns: number = +rowStart.getAttribute('data-columns')!;
      rowStart.append(...this.getNextNSiblings(rowStart.parentElement!, columns));
    });
    
    this.animate$.pipe(throttleTime(75)).subscribe(() => {
      this.animateFn();
    })
  }

  getNextNSiblings(element: HTMLElement, siblingNum: number): ChildNode[] {
    let siblings = [];
    let sibling = element.nextSibling;

    while (sibling && siblings.length < siblingNum) {
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }

    return siblings;
  }

  columnIndex = 0;

  setRowColumnIndex(rowStartSection: ArticleRowStartSection): boolean {
    this.columnIndex = rowStartSection.columns;
    return true;
  }

  /** returns true so it can be used in a template if statement */
  decrementRowColumnIndex(): boolean {
    if (this.columnIndex > 0) {
      this.columnIndex -= 1;
    }
    return true;
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.animate$.next();
  }

  private animateFn() {
    const clientHeight = window.innerHeight;
    const transitionEnd = clientHeight / 2.5;
    for (const section of this.sectionContainers) {
      const y = clientHeight - section.nativeElement.getBoundingClientRect().top;
      section.nativeElement.style.transform = `scale(${mapRange(y, 0, transitionEnd, 0.9)})`
      section.nativeElement.style.opacity = `${mapRange(y, 0, transitionEnd, 0)}`
    }
  }
}



export function mapRange(value: number, in_min: number, in_max: number, outMin: number): number {
  const remapped = (value - in_min) * (1 - outMin) / (in_max - in_min) + outMin;
  return Math.max(0, Math.min(remapped, 1))
}