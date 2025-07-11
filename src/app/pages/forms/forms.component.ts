import { Component, inject, Input, SecurityContext } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StrapiService } from '../../services/strapi.service';
import { SentForm } from '../../shared/shared-types';
import { MailformService } from '../../services/mailform.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpStatusCode } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forms',
  imports: [RouterLink],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
  standalone: true,
})
export class FormsComponent {

  @Input() title = "";
  @Input() subject = "";

  mailFormSv = inject(MailformService);
  sanitizer = inject(DomSanitizer);
  strapiSv = inject(StrapiService);

  sentStatus = 0;

  async send() {

    const form: SentForm = {
      data: {
        type: this.subject,
        text: "",
      }
    }

    this.sentStatus = 0;
    let mailHtml = `<h2>${this.subject}</h2><br><br>`;

    Array.from(document.querySelectorAll(".form-block"))
      .forEach(formBlock => {
        const question = formBlock.querySelector("label")?.innerText ?? "";
        let input: HTMLTextAreaElement | HTMLInputElement | null = formBlock.querySelector("input");
        input ??= formBlock.querySelector("textarea");
        const answer = input?.value || '(keine Antwort)';

        form.data.text += `${question}\n ${answer}\n\n`;

        mailHtml += `<strong>${this.sanitizer.sanitize(SecurityContext.HTML, question)}</strong><br><span>${this.sanitizer.sanitize(SecurityContext.HTML, answer)}</span><br><br> `;
      });


    try {
      await firstValueFrom(this.strapiSv.create("forms", form));
      this.sentStatus = 200;
    } catch (e) {
      console.log(e);
    }
/*
  this.sentStatus = await this.mailFormSv.send({
    subject: this.subject,
    content: mailHtml,
  });*/

    if (this.sentStatus == 200) {
      window.scrollTo({top: 0});
    }
  }

  HttpStatusCode = HttpStatusCode;
}
