import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarinaQuinterosComponent } from './karina-quinteros.component';

describe('KarinaQuinterosComponent', () => {
  let component: KarinaQuinterosComponent;
  let fixture: ComponentFixture<KarinaQuinterosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KarinaQuinterosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarinaQuinterosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
