import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauraZarate } from './laura-zarate';

describe('LauraZarate', () => {
  let component: LauraZarate;
  let fixture: ComponentFixture<LauraZarate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LauraZarate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LauraZarate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
