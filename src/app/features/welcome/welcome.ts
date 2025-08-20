/**
 * Source: src/app/features/welcome/welcome.ts
 * @packageDocumentation
 */
// src/app/features/welcome/welcome.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './welcome.html',   // ✅ correct template
  styleUrls: ['./welcome.scss']
})
export /**
 * WelcomeComponent: myFlix Angular component/service/model.
 */
class WelcomeComponent {
  constructor(private dialog: MatDialog) {}
  openLogin(): void {
    this.dialog.open(LoginDialogComponent);
  }
}


