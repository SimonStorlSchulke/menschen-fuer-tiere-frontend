import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ArticleComponent, ArticleSection } from '../../article/article.component';
import { MemberApplicationComponent } from '../forms/member-application/member-application.component';
import { SponsorhipApplicationComponent } from '../forms/sponsorship-application/sponsorship-application.component';
import { InfoPopupComponent } from '../../layout/info-popup/info-popup.component';
import { TeammembersListComponent } from "../../teammembers-list/teammembers-list.component";

export type DefaultPageData = {
  id: number,
  name: string,
  url: string,
  description: string,
  article: ArticleSection[],
  createdAt: Date,
}

@Component({
    selector: 'app-blog',
  imports: [InfoPopupComponent, ArticleComponent, MemberApplicationComponent, SponsorhipApplicationComponent, InfoPopupComponent, TeammembersListComponent],
    templateUrl: './default-page.component.html',
    styleUrl: './default-page.component.scss',
  standalone: true,
})
export class DefaultPageComponent {

  pageData?: DefaultPageData;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)

  route = "";

  constructor() {
    this.activatedRoute.data.pipe(takeUntilDestroyed())
    .subscribe(({ pageData }) => {
        this.route = this.router.url;
        this.pageData = pageData;
      }
      );

  }
}
