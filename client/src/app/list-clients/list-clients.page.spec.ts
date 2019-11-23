import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClientsPage } from './list-clients.page';

describe('ListClientsPage', () => {
  let component: ListClientsPage;
  let fixture: ComponentFixture<ListClientsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClientsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClientsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
