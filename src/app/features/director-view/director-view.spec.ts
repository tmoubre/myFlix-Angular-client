import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorView } from './director-view';

describe('DirectorView', () => {
  let component: DirectorView;
  let fixture: ComponentFixture<DirectorView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


