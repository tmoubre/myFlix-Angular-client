/**
 * Source: src/app/features/movies/dialogs/synopsis-dialog.component.ts
 * @packageDocumentation
 */
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-synopsis-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data?.title || 'Synopsis' }}</h2>
    <mat-dialog-content>
      <p>{{ data?.description || 'No synopsis available.' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `
})
export /**
 * SynopsisDialogComponent: myFlix Angular component/service/model.
 */
class SynopsisDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SynopsisDialogComponent>
  ) {}
  close() { this.ref.close(); }
}




