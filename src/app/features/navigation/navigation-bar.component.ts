// src/app/features/navigation/navigation-bar.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule],
  // ✅ inline template so Angular doesn't look for a missing HTML file
  template: `
    <mat-toolbar color="primary">
      <span class="spacer"></span>
      <button mat-button routerLink="/movies" *ngIf="user()">Movies</button>
      <button mat-button routerLink="/profile" *ngIf="user()">Profile</button>
      <button mat-button (click)="logout()" *ngIf="user()">Logout</button>
      <button mat-button routerLink="/login" *ngIf="!user()">Login</button>
      <button mat-button routerLink="/signup" *ngIf="!user()">Sign Up</button>
    </mat-toolbar>
  `,
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {
  user = signal<string | null>(localStorage.getItem('user'));
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user.set(null);
  }
}

