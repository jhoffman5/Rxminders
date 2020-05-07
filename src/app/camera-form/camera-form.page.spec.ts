import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraFormPage } from './camera-form.page';

describe('CameraFormPage', () => {
  let component: CameraFormPage;
  let fixture: ComponentFixture<CameraFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
