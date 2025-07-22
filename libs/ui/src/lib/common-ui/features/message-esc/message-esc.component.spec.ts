import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEscComponent } from './message-esc.component';

describe('MessageEscComponent', () => {
  let component: MessageEscComponent;
  let fixture: ComponentFixture<MessageEscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageEscComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageEscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
