import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AgendaCulturalService } from './agenda-cultural.service';

describe('AgendaCulturalService', () => {
  let service: AgendaCulturalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });
    service = TestBed.inject(AgendaCulturalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
