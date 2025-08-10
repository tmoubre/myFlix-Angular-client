import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie } from '../../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
  <mat-card>
    <img *ngIf="movie.imageUrl" [src]="movie.imageUrl" [alt]="movie.title" style="width:100%; height:300px; object-fit:cover;" />
    <mat-card-title>{{ movie.title }}</mat-card-title>
    <mat-card-content>
      <p>{{ movie.description }}</p>
    </mat-card-content>
    <mat-card-actions>
      <button mat-stroked-button (click)="toggleFavorite.emit()" [color]="favorite ? 'warn' : undefined">
        <mat-icon>{{ favorite ? 'favorite' : 'favorite_border' }}</mat-icon>
        {{ favorite ? 'Unfavorite' : 'Favorite' }}
      </button>
    </mat-card-actions>
  </mat-card>
  `
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() favorite = false;
  @Output() toggleFavorite = new EventEmitter<void>();
}
