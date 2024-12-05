import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {StrapiService} from '../../services/strapi.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

type HeaderItem = {
  label: string,
  link?: string,
  children?: Array<{
    label: string,
    link: string
  }>,
}

type subPageLink = {
  id: number,
  name: string,
  urlName: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  items: HeaderItem[] = [
    {label: "Home", link: "/"},
    {label: "Über uns", link: "/ueber-uns"},
    {label: "Hunde", link: "/tiere/hunde"},
    {label: "Vermittlung", link: "/vermittlung"},
    {label: "Helfen", link: "/helfen"},
    {label: "News & Wissen", link: "/news"},
    {label: "Kontakt", link: "/kontakt"},
  ]


  openedDropdownIndex: number = -1;
  burgerMenuOpen: boolean = false;

  strapiSv = inject(StrapiService);

  @ViewChild("navDesktop") navDesktop!: ElementRef;
  previousScrollPosition = 0;
  showHeader = true;
  desktopHeaderHeight = 96;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScrollPosition = document.documentElement.scrollTop ?? 0;
    this.showHeader = currentScrollPosition < this.previousScrollPosition || currentScrollPosition < 100;
    if(!this.showHeader) this.burgerMenuOpen = false;
    this.desktopHeaderHeight = currentScrollPosition > 200 ? 66 : 86;
    this.previousScrollPosition = currentScrollPosition;
  }

  constructor() {
    this.strapiSv.get<subPageLink[]>("convey-subpages?fields[0]=name&fields[1]=urlName")
      .pipe(takeUntilDestroyed())
      .subscribe(subPageData => {
        this.items[3].children = subPageData.map(element => {
          return {
            label: element.name,
            link: "vermittlung/" + element.urlName,
          }
        })
      });

    this.strapiSv.get<subPageLink[]>("help-subpages?fields[0]=name&fields[1]=urlName")
      .pipe(takeUntilDestroyed())
      .subscribe(subPageData => {
        this.items[4].children = subPageData.map(element => {
          return {
            label: element.name,
            link: "helfen/" + element.urlName,
          }
        })
      });
  }

  @HostListener('document:mouseup', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.openedDropdownIndex == -1) return;
    if (!((event.target as HTMLElement).classList.contains("dropdown-index-" + this.openedDropdownIndex))) {
      this.openedDropdownIndex = -1;
      this.burgerMenuOpen = false;
    } else {
    }
  }


}
