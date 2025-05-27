import { Component, inject } from '@angular/core';
import { StrapiService } from '../services/strapi.service';
import { TeamMember, TeammemberTileComponent } from '../pages/contact/teammember-tile/teammember-tile.component';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-teammembers-list',
  imports: [TeammemberTileComponent, AsyncPipe],
  templateUrl: './teammembers-list.component.html',
  styleUrl: './teammembers-list.component.scss'
})
export class TeammembersListComponent {
  teammembers$ = inject(StrapiService).get<TeamMember[]>
      ("teammembers?populate=*&sort[0]=priority:desc").pipe(map((list) => {
        const m = new Map<string, TeamMember[]>([
          ["ehrenamtlich", []],
          ["tierheim", []],
          ["vorstand", []],
        ]);
        for (const member of list) {
          m.get(member.category)?.push(member)
        }
        return m;
      }));
}
