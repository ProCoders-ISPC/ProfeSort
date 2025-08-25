import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarinaQuinteros } from './karina-quinteros.component';

describe('KarinaQuinteros', () => {
  let component: KarinaQuinteros;
  let fixture: ComponentFixture<KarinaQuinteros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KarinaQuinteros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarinaQuinteros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});