import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { LightboxComponent } from 'src/app/shared/lightbox/lightbox.component';

@Component({
  selector: 'app-default-layout',
  imports: [
    FooterComponent,
    HeaderComponent,
    LightboxComponent,
    RouterOutlet,
    LightboxComponent,
    HeaderComponent,
    FooterComponent,
    LightboxComponent
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent {

}
