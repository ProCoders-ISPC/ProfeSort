import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enviroments } from './enviroments';

describe('Enviroments', () => {
  let component: Enviroments;
  let fixture: ComponentFixture<Enviroments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enviroments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enviroments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
