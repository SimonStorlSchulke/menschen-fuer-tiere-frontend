import { Component } from '@angular/core';
import { FormsComponent } from '../forms.component';
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-member-application',
    imports: [FormsComponent, FormsModule],
    templateUrl: './member-application.component.html',
    styleUrl: './member-application.component.scss'
})
export class MemberApplicationComponent {
  applicantName = "";
}
