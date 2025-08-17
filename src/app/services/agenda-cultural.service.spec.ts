import { TestBed } from '@angular/core/testing';

import { AgendaCulturalService } from './agenda-cultural.service';

describe('AgendaCulturalService', () => {
  let service: AgendaCulturalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgendaCulturalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
