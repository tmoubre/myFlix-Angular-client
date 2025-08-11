import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
template: `
  <mat-card>
    <img *ngIf="movie?.ImagePath" [src]="movie.ImagePath" [alt]="movie?.Title"
         style="width:100%; height:300px; object-fit:cover;" />
    <mat-card-header>
      <mat-card-title>{{ movie?.Title }}</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <p>{{ movie?.Description }}</p>
    </mat-card-content>

    <mat-card-actions>
      <button mat-icon-button (click)="toggleFavorite(movie?._id)">
        <mat-icon>{{ isFavorite(movie?._id) ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
    </mat-card-actions>
  </mat-card>
`,
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() favorite = false;
  @Output() toggleFavorite = new EventEmitter<void>();
}
