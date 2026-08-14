import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonToGoogleMapsComponent } from './button-to-google-maps.component';

describe('ButtonToGoogleMapsComponent', () => {
  let component: ButtonToGoogleMapsComponent;
  let fixture: ComponentFixture<ButtonToGoogleMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonToGoogleMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonToGoogleMapsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lat', '41.3851');
    fixture.componentRef.setInput('lon', '2.1734'); 
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
