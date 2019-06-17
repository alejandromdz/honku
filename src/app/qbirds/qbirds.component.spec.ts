import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QBirdsComponent } from './qbirds.component';

describe('QBirdsComponent', () => {
  let component: QBirdsComponent;
  let fixture: ComponentFixture<QBirdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QBirdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QBirdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
