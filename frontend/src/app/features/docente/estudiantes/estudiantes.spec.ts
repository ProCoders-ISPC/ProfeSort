import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Estudiantes } from './estudiantes';

describe('Estudiantes', () => {
  let component: Estudiantes;
  let fixture: ComponentFixture<Estudiantes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Estudiantes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Estudiantes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
