import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  // ── Normalise backend user (uses `image`) → frontend user (uses `profile_photo`) ──
  private normalise(user: any) {
    return {
      ...user,
      profile_photo: user.image ?? user.profile_photo ?? null,
    };
  }

  signup(userData: any): Observable<any> {
    // Strip confirmPassword before sending to backend
    const { confirmPassword, ...payload } = userData;
    return this.http.post('/api/auth/signup', payload);
  }

  signin(credentials: any): Observable<any> {
    return this.http.post<any>('/api/auth/signin', credentials).pipe(
      tap(response => {
        const user = this.normalise(response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/signin']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  updateProfile(profileData: any): Observable<any> {
    const token = this.getToken();
    // Map profile_photo → image for backend
    const payload: any = { name: profileData.name };
    if (profileData.profile_photo !== undefined) {
      payload.image = profileData.profile_photo;
    }

    return this.http.put<any>('/api/user/profile', payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        // Use server-returned user to stay in sync
        const user = this.normalise(response.user);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  deleteAccount(): Observable<any> {
    const token = this.getToken();
    return this.http.delete('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => this.logout())
    );
  }
}
