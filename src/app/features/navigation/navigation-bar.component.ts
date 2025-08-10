// src/app/features/navigation/navigation-bar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  template: `
    <mat-toolbar color="primary">
      <span class="app-title" (click)="goHome()">myFlix</span>
      <span class="spacer"></span>

      <button mat-button routerLink="/movies" *ngIf="user">Movies</button>
      <button mat-button routerLink="/profile" *ngIf="user">Profile</button>

      <button mat-button (click)="logout()" *ngIf="user">Logout</button>
      <button mat-button routerLink="/login" *ngIf="!user">Login</button>
      <button mat-button routerLink="/signup" *ngIf="!user">Sign Up</button>
    </mat-toolbar>
  `,
  styles: [`
    .app-title {
      cursor: pointer;
      font-weight: bold;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class NavigationBarComponent {
  @Input() user: any;
  @Output() loggedOut = new EventEmitter<void>();

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/movies']);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedOut.emit();
    this.router.navigate(['/login']);
  }
}
