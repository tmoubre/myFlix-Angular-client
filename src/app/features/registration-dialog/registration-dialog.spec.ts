import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDialog } from './registration-dialog';

describe('RegistrationDialog', () => {
  let component: RegistrationDialog;
  let fixture: ComponentFixture<RegistrationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


