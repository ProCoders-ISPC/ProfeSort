import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generalbuttons } from './generalbuttons';

describe('Generalbuttons', () => {
  let component: Generalbuttons;
  let fixture: ComponentFixture<Generalbuttons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generalbuttons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Generalbuttons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
