import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToHomeButton } from './back-to-home-button';

describe('BackToHomeButton', () => {
  let component: BackToHomeButton;
  let fixture: ComponentFixture<BackToHomeButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackToHomeButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackToHomeButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
