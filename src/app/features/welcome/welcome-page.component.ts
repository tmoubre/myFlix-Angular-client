/**
 * Source: src/app/features/welcome/welcome-page.component.ts
 * @file
 */
// src/app/features/welcome/welcome-page.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Adjust these paths if your Register/Login components live elsewhere:
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from './login.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './welcome-page.component.html',
})
export /**
 * WelcomePageComponent: myFlix Angular component/service/model.
 */
class WelcomePageComponent {
  private dialog = inject(MatDialog);

  openRegisterDialog() {
    this.dialog.open(RegisterComponent, { width: '360px', disableClose: true });
  }

  openLoginDialog() {
    this.dialog.open(LoginComponent, { width: '360px', disableClose: true });
  }
}
