import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMapComponent } from './event-map.component';

describe('EventMapComponent', () => {
  let component: EventMapComponent;
  let fixture: ComponentFixture<EventMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMapComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lat', '41.3851');
    fixture.componentRef.setInput('lng', '2.1734');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
