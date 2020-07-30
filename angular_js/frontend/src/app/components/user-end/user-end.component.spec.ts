import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEndComponent } from './user-end.component';

describe('UserEndComponent', () => {
  let component: UserEndComponent;
  let fixture: ComponentFixture<UserEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
