import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="title">{{ data.title }}</h2>

    <mat-dialog-content class="content">
      <img *ngIf="data.image" [src]="data.image" [alt]="data.title" />
      <div class="meta">
        <div><strong>Genre:</strong> {{ data.genreName || '—' }}</div>
        <div><strong>Director:</strong> {{ data.directorName || '—' }}</div>
      </div>
      <p class="description">{{ data.description }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="toggleFav()">
        <mat-icon>{{ fav ? 'favorite' : 'favorite_border' }}</mat-icon>
        {{ fav ? 'Remove from favorites' : 'Add to favorites' }}
      </button>
      <button mat-button (click)="ref.close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host { display:block; }
    .title { margin:0 0 8px; line-height:1.2; }
    .content { display:grid; gap:12px; }
    .content img {
      width:100%;
      max-height:420px;
      object-fit:cover;
      border-radius:8px;
    }
    .meta { font-size:14px; display:grid; gap:4px; }
    .description { white-space:pre-wrap; margin:6px 0 0; }
  `]
})
export class MovieDetailsDialog {
  fav = false;

  constructor(
    public ref: MatDialogRef<MovieDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fav = !!(data?.favorite);
  }

  toggleFav(): void {
    this.fav = !this.fav;        // update icon immediately
    this.ref.close({ toggle: true }); // signal parent to perform API call
  }
}

