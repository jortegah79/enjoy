import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperCategoriasComponent } from './swiper-categorias.component';

describe('SwiperCategoriasComponent', () => {
  let component: SwiperCategoriasComponent;
  let fixture: ComponentFixture<SwiperCategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperCategoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperCategoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
