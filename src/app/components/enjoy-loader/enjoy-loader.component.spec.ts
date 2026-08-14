import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnjoyLoaderComponent } from './enjoy-loader.component';

describe('EnjoyLoaderComponent', () => {
  let component: EnjoyLoaderComponent;
  let fixture: ComponentFixture<EnjoyLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnjoyLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnjoyLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
