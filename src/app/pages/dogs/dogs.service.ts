import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DogsService {

  filters = new Map<string, Map<string, boolean>>([
    [
      'freeroamer',
      new Map([
        ['yes', false],
        ['no', false],
      ]),
    ],
    [
      'size',
      new Map([
        ['small', false],
        ['medium', false],
        ['large', false],
      ]),
    ],
    [
      'gender',
      new Map([
        ['male', false],
        ['female', false],
      ]),
    ],
    [
      'age',
      new Map([
        ['young', false],
        ['medium', false],
        ['old', false],
      ]),
    ],
  ]);

  lastSelectedDogId: number = -1;

  dogSelected(id: number) {
    this.lastSelectedDogId = id;
  }
}
