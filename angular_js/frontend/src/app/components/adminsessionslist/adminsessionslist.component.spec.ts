import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminsessionslistComponent } from './adminsessionslist.component';

describe('AdminsessionslistComponent', () => {
  let component: AdminsessionslistComponent;
  let fixture: ComponentFixture<AdminsessionslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminsessionslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminsessionslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
