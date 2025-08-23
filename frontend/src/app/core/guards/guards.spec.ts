import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards';
import { AuthService } from '../services/services';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to login if not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});


