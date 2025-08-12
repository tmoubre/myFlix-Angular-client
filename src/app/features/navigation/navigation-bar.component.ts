// src/app/features/navigation/navigation-bar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span class="brand" routerLink="/movies">myFlix</span>
      <span class="spacer"></span>

      <ng-container *ngIf="loggedIn(); else guest">
        <button mat-button routerLink="/movies" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Movies</button>
        <button mat-button routerLink="/profile" routerLinkActive="active">Profile</button>
        <button mat-button (click)="logout()">Logout</button>
      </ng-container>

      <ng-template #guest>
        <button mat-button routerLink="/login" routerLinkActive="active">Sign in</button>
        <button mat-button routerLink="/register" routerLinkActive="active">Create account</button>
      </ng-template>
    </mat-toolbar>
  `,
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  constructor(private router: Router) {}

  loggedIn(): boolean {
    try { return !!localStorage.getItem('token'); } catch { return false; }
  }

  logout(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
    this.router.navigateByUrl('/login');
  }
}
