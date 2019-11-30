import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonListComponent } from './neon-list.component';

describe('NeonListComponent', () => {
  let component: NeonListComponent;
  let fixture: ComponentFixture<NeonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
