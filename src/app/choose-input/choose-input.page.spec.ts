import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseInputPage } from './choose-input.page';

describe('ChooseInputPage', () => {
  let component: ChooseInputPage;
  let fixture: ComponentFixture<ChooseInputPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseInputPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
