import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HonkuComponent } from './honku.component';

describe('HonkuComponent', () => {
  let component: HonkuComponent;
  let fixture: ComponentFixture<HonkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HonkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HonkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
