import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Movie, LegacyMovie } from '../../../models/movie.models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  @Input() movie!: Movie | LegacyMovie;
  @Input() favorite = false;                 // show red heart when true
  @Output() view = new EventEmitter<Movie | LegacyMovie>();
  @Output() toggle = new EventEmitter<void>(); // parent will add/remove favorite

  get title(): string { const m: any = this.movie; return m.title ?? m.Title ?? ''; }
  get description(): string { const m: any = this.movie; return m.description ?? m.Description ?? ''; }
  get image(): string | undefined { const m: any = this.movie; return m.ImageUrl ?? m.ImagePath; }

  // keep card click opening the details, but stop it when clicking the heart
  onHeartClick(ev: MouseEvent) {
    ev.stopPropagation();
    this.toggle.emit();
  }
  onCardClick() {
    this.view.emit(this.movie);
  }
}
