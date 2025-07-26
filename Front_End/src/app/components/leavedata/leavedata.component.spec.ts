import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavedataComponent } from './leavedata.component';

describe('LeavedataComponent', () => {
  let component: LeavedataComponent;
  let fixture: ComponentFixture<LeavedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavedataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
