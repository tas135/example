import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmincreatesessionsComponent } from './admincreatesessions.component';

describe('AdmincreatesessionsComponent', () => {
  let component: AdmincreatesessionsComponent;
  let fixture: ComponentFixture<AdmincreatesessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmincreatesessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmincreatesessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
