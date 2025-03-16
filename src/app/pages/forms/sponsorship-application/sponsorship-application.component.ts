import { Component } from '@angular/core';
import { FormsComponent } from '../forms.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sponsorship-application',
    imports: [FormsComponent, FormsModule],
    templateUrl: './sponsorship-application.component.html',
    styleUrl: './sponsorship-application.component.scss',
  standalone: true,
})
export class SponsorhipApplicationComponent {
  applicantName = "";
  animalName = "";
}
