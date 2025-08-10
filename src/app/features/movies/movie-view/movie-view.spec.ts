import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieView } from './movie-view';

describe('MovieView', () => {
  let component: MovieView;
  let fixture: ComponentFixture<MovieView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
