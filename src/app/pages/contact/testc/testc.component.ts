import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-testc',
  standalone: true,
  imports: [],
  templateUrl: './testc.component.html',
  styleUrl: './testc.component.scss'
})
export class TestcComponent {

  @Input() autogrow: (area: HTMLTextAreaElement) => void;
}
