import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    private baseUrl = '/api/projects';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
    }

    getProject(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    createProject(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, data, { headers: this.getHeaders() });
    }

    updateProject(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() });
    }

    deleteProject(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }
}
