import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Lab2Component } from './lab-2.component';

describe('Lab2Component', () => {
  let component: Lab2Component;
  let fixture: ComponentFixture<Lab2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Lab2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Lab2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});