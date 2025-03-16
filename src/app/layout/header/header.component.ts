import {Component, ElementRef, HostListener, inject, ViewChild} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {StrapiService} from '../../services/strapi.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { SitemapService } from '../../services/sitemap.service';

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
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent {
  items: HeaderItem[] = [
    {label: "Home", link: "/"},
    {label: "Über uns", link: "/ueber-uns"},
    {label: "Tiere", link: "/tiere", children: [
        {label: "Hunde", link: "/tiere/Hunde"},
        {label: "Katzen", link: "/tiere/Katzen"},
        {label: "Kleintiere", link: "/tiere/Kleintiere"},
        {label: "Vermisst", link: "/tiere/vermisst"},
        {label: "Zuhause Gefunden", link: "/tiere/zuhause-gefunden"},
        {label: "Fundtiere", link: "/tiere/fundtier"},
      ]},
/*    {label: "Vermittlung", link: "/vermittlung", children: [
        {label: "Vermittlungshilfe Hund", link: "/vermittlung/hund"},
        {label: "Vermittlungshilfe Katze", link: "/vermittlung/katze"},
      ]},*/
    {label: "Helfen", link: "/helfen"},
    {label: "Veranstaltungen", link: "/news"},
    {label: "Wissenswertes", link: "/wissenswertes"},
    {label: "Sponsoren ♥", link: "/sponsoren"},
    {label: "Tierheimjugend", link: "/tierheimjugend"},
    {label: "Kontakt", link: "/kontakt"},
  ]


  openedDropdownIndex: number = -1;
  burgerMenuOpen: boolean = false;

  strapiSv = inject(StrapiService);
  siteMapSv = inject(SitemapService);

  @ViewChild("navDesktop") navDesktop!: ElementRef;
  previousScrollPosition = 0;
  showHeader = true;
  desktopHeaderHeight = 96;



  constructor() {


    this.siteMapSv.getSitemap().subscribe()

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
