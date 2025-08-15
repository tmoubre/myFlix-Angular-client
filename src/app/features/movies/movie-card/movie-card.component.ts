/**
 * Source: src/app/features/movies/movie-card/movie-card.component.ts
 * @file
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const PLACEHOLDER = 'assets/poster-placeholder.jpg';
// Keep HOST if you ever want absolute URLs; not required with the proxy
const HOST = 'https://film-app-f9566a043197.herokuapp.com';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export /**
 * MovieCardComponent: myFlix Angular component/service/model.
 */
class MovieCardComponent {
  @Input() movie!: any;
  @Input() favorite = false;

  @Output() view = new EventEmitter<void>();
  @Output() genre = new EventEmitter<void>();
  @Output() director = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  /** Normalize all the variations we’ve seen coming from the API */
  posterSrc(m: any): string {
    const abs = m?.ImageUrl ?? m?.imageUrl ?? m?.ImageURL ?? m?.image;
    if (typeof abs === 'string' && /^https?:\/\//i.test(abs)) return abs;

    const rel =
      (typeof m?.ImageUrl === 'string' ? m.ImageUrl : '') ||
      (typeof m?.imageUrl === 'string' ? m.imageUrl : '') ||
      (typeof m?.ImagePath === 'string' ? m.ImagePath : '') ||
      (typeof m?.imagePath === 'string' ? m.imagePath : '');

    if (rel) {
      if (/^\/?imageUrl\//i.test(rel)) return `/${rel.replace(/^\/+/, '')}`;
      if (/^https?:\/\//i.test(rel)) return rel;
      return `/imageUrl/${encodeURIComponent(rel)}`;
      // If you prefer absolute: return `${HOST}/imageUrl/${encodeURIComponent(rel)}`;
    }

    return PLACEHOLDER;
  }

  get poster(): string { return this.posterSrc(this.movie); }

  get title(): string {
    return this.movie?.title ?? this.movie?.Title ?? 'Untitled';
  }

  get directorName(): string {
    return this.movie?.Director?.Name ?? this.movie?.director?.name ?? 'Unknown';
  }

  onImgError(ev: Event): void {
    (ev.target as HTMLImageElement).src = PLACEHOLDER;
  }
}










