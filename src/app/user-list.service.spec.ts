import { TestBed, inject } from '@angular/core/testing';

import { UserListService } from './user-list.service';

describe('UserListServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserListService]
    });
  });

  it('should be created', inject([UserListService], (service: UserListService) => {
    expect(service).toBeTruthy();
  }));
});
