import { Component } from '@angular/core';
import { FormsComponent } from '../forms.component';
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-apply',
    imports: [FormsComponent, FormsModule],
    templateUrl: './apply.component.html',
    styleUrl: './apply.component.scss'
})
export class ApplyComponent  {

  animalName = "";
}
