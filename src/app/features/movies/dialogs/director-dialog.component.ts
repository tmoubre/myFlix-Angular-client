/**
 * Source: src/app/features/movies/dialogs/director-dialog.component.ts
 * @packageDocumentation
 */
// src/app/features/movies/dialogs/director-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-director-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.Name || data?.name || 'Director' }}</h2>
    <mat-dialog-content>
      <p style="white-space:pre-line">{{ data?.Bio || data?.bio || 'No bio available.' }}</p>
      <div *ngIf="data?.Birth || data?.birth"><b>Birth:</b> {{ data?.Birth || data?.birth }}</div>
      <div *ngIf="data?.Death || data?.death"><b>Death:</b> {{ data?.Death || data?.death }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `
})
export /**
 * DirectorDialogComponent: myFlix Angular component/service/model.
 */
class DirectorDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<DirectorDialogComponent>
  ) {}
  close() { this.ref.close(); }
}



