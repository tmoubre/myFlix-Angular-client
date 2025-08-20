// src/app/fetch-api-data.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FetchApiDataService, NewUser, User } from './fetch-api-data.service';
import { environment } from '../environments/environment';

describe('FetchApiDataService', () => {
  let service: FetchApiDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FetchApiDataService]
    });
    service = TestBed.inject(FetchApiDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('register() should POST /users', () => {
    const payload: NewUser = { Username: 'a', Password: 'b', Email: 'a@b.com' };
    const mock: User = { _id: '1', Username: 'a', Email: 'a@b.com', FavoriteMovies: [] };

    service.register(payload).subscribe(u => expect(u).toEqual(mock));
    const req = httpMock.expectOne(`${environment.apiUrl.replace(/\/+$/, '')}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(mock);
  });
});


