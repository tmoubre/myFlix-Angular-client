/**
 * Source: src/app/features/movies/dialogs/genre-dialog.component.ts
 * @packageDocumentation
 */
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-genre-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.Name || data?.name || 'Genre' }}</h2>
    <mat-dialog-content>
      <p>{{ data?.Description || data?.description || 'No description.' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `
})
export /**
 * GenreDialogComponent: myFlix Angular component/service/model.
 */
class GenreDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<GenreDialogComponent>
  ) {}
  close() { this.ref.close(); }
}



