import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareElementComponent } from './share-element.component';

describe('ShareElementComponent', () => {
  let component: ShareElementComponent;
  let fixture: ComponentFixture<ShareElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
