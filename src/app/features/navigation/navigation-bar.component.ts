/**
 * Source: src/app/features/navigation/navigation-bar.component.ts
 * @packageDocumentation
 */
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
      <span class="brand" routerLink="/movies" style="cursor:pointer;">myFlix</span>
      <span class="spacer"></span>

      <ng-container *ngIf="loggedIn(); else guest">
        <a mat-button routerLink="/movies" routerLinkActive="active">Movies</a>
        <a mat-button routerLink="/profile" routerLinkActive="active">Profile</a>
        <button mat-button (click)="logout()">Logout</button>
      </ng-container>

      <ng-template #guest>
        <a mat-button routerLink="/login">Login</a>
        <a mat-button routerLink="/register">Sign Up</a>
      </ng-template>
    </mat-toolbar>
  `,
  styles: [`.spacer{flex:1 1 auto}`]
})
export /**
 * NavigationBarComponent: myFlix Angular component/service/model.
 */
class NavigationBarComponent {
  constructor(private router: Router) {}
  loggedIn(): boolean { try { return !!localStorage.getItem('token'); } catch { return false; } }
  logout(): void {
    try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch {}
    this.router.navigateByUrl('/login');
  }
}



