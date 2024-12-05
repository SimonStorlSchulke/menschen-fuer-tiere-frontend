import {inject, Injectable} from '@angular/core';
import {StrapiService} from './strapi.service';
import {HttpClient} from '@angular/common/http';
import {catchError, firstValueFrom, map} from 'rxjs';

export type FormMail = {
  subject: string,
  content: string,
}

@Injectable({
  providedIn: 'root'
})
export class MailformService {

  strapiSv = inject(StrapiService);
  httpClient = inject(HttpClient);


  async send(mail: FormMail): Promise<number> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer e168baf22ad1319def4403e5954185b5d317936b94b056b6014cdfd481fa5fe1bd44c82ed38c2f666b668dcad647153a27709aa19bad690b42975d3497623f39a4a94658f64a28c88aa68c824a1e7e108adb62ef918bd1dd07682f69e564d04cc481278bde8b6512360d2c34fe0ea7a6fead23e039a136df9163b669897985ae`,
    };

    mail.content += '<br><br><p><b>Antwort bitte nicht per "Antworten" Funktion des Mailprogramms, sondern explizit an die vom Sender angegebene EmailAdresse schicken.</b></p>'

    const requestBody = {
      subject: mail.subject,
      content: mail.content,
      isTest: this.strapiSv.isDevEnv,
    }

    let url = StrapiService.apiBaseUrl + "mailform/custom-post";
    return await firstValueFrom(this.httpClient
      .post(url, requestBody, {
        headers: headers,
      })

      .pipe(
        map((response: any) => {
          return response.status;
        }),
        catchError((error: any) => {
          return [error.status];
        })
      ));
  }
}
