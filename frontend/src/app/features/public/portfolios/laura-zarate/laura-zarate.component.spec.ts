import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauraZarateComponent } from './laura-zarate.component';

describe('LauraZarateComponent', () => {
  let component: LauraZarateComponent;
  let fixture: ComponentFixture<LauraZarateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [LauraZarateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LauraZarateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
