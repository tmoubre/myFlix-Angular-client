// src/app/features/welcome/welcome.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material modules this component uses
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule }  from '@angular/material/button';
import { MatIconModule }    from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

// If you'll open a dialog:
import { LoginDialogComponent } from '../login-dialog/login-dialog';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    LoginDialogComponent // so it can be used/opened
  ],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss']
})
export class WelcomeComponent {
  constructor(private dialog: MatDialog) {}

  openLogin() { this.dialog.open(LoginDialogComponent); }
}
