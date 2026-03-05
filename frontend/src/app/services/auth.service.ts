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

  signup(userData: any): Observable<any> {
    return this.http.post('/api/auth/signup', userData);
  }

  signin(credentials: any): Observable<any> {
    return this.http.post<any>('/api/auth/signin', credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
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
    return this.http.put('/api/user/profile', profileData, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(() => {
        const user = { ...this.currentUserSubject.value, ...profileData };
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
