import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPagePage } from './info-page.page';

describe('InfoPagePage', () => {
  let component: InfoPagePage;
  let fixture: ComponentFixture<InfoPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
