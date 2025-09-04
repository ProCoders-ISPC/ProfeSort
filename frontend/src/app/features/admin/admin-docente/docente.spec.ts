import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Docente } from './docente';

describe('Docente', () => {
  let component: Docente;
  let fixture: ComponentFixture<Docente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Docente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Docente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
