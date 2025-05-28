import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewChildren, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { FileSection, FileSectionComponent } from "./article-sections/file-section/file-section.component";

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
  | ArticleCounterSection
  | FileSection;



export type ArticleRowStartSection = {
  __component: 'article-section.row-start';
  title: string;
  background?: "nein" | "grün" | "beige";
  columns: number;
  textCentered: boolean;
};

@Component({
    selector: 'app-article',
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
    FileSectionComponent,
],
    templateUrl: './article.component.html',
    styleUrl: './article.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleComponent implements AfterViewInit {
  @Input({required: true}) sections!: ArticleSection[];
  @ViewChild("article") articleElement!: ElementRef;

  @ViewChildren("sectionContainer") sectionContainers!: ElementRef<HTMLElement>[];

  constructor(cdRef: ChangeDetectorRef) {
    inject(ActivatedRoute).url.subscribe(() => {
      cdRef.markForCheck();
    })
  }

  ngAfterViewInit() {
    const rowStartTags = (this.articleElement.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('.article-rows');
    rowStartTags.forEach((rowStart) => {
      const columns: number = +rowStart.getAttribute('data-columns')!;
      rowStart.append(...this.getNextNSiblings(rowStart.parentElement!, columns));
    });
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
}
