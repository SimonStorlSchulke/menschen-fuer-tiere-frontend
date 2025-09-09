import { Component, Input, inject } from '@angular/core';
import { Animal } from '../shared-types';
import { AnimalService } from '../../services/animal.service';
import { RouterLink } from '@angular/router';
import { DogsService } from "../../pages/dogs/dogs.service";

@Component({
  selector: 'app-animal-tile',
  imports: [RouterLink],
  templateUrl: './animal-tile.component.html',
  styleUrl: './animal-tile.component.scss',
  standalone: true,
})
export class AnimalTileComponent {

  animalSv = inject(AnimalService);
  dogsSv = inject(DogsService);
  @Input({required: true}) animal!: Animal;


}
