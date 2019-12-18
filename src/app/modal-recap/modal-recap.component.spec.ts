import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecapComponent } from './modal-recap.component';

describe('ModalRecapComponent', () => {
  let component: ModalRecapComponent;
  let fixture: ComponentFixture<ModalRecapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRecapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
