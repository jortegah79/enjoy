import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperImagesComponent } from './swiper-images.component';

describe('SwiperImagesComponent', () => {
  let component: SwiperImagesComponent;
  let fixture: ComponentFixture<SwiperImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
