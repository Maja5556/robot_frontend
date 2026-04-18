import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sketch } from './sketch';

describe('Sketch', () => {
  let component: Sketch;
  let fixture: ComponentFixture<Sketch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sketch],
    }).compileComponents();

    fixture = TestBed.createComponent(Sketch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
