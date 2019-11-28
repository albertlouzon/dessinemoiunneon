import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeonFormComponent } from './neon-form.component';

describe('NeonFormComponent', () => {
  let component: NeonFormComponent;
  let fixture: ComponentFixture<NeonFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeonFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
