import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsessionsdetailComponent } from './adminsessionsdetail.component';

describe('AdminsessionsdetailComponent', () => {
  let component: AdminsessionsdetailComponent;
  let fixture: ComponentFixture<AdminsessionsdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsessionsdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsessionsdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
