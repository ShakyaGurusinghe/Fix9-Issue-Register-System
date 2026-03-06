import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class IssueService {

    private baseUrl = '/api/issues';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getIssues(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl, { headers: this.getHeaders() });
    }

    getProjectIssues(projectId: string | number): Observable<any[]> {
        return this.http.get<any[]>(`/api/projects/${projectId}/issues`, { headers: this.getHeaders() });
    }

    getIssue(id: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    createIssue(data: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, data, { headers: this.getHeaders() });
    }

    updateIssue(id: string, data: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() });
    }

    deleteIssue(id: string): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }
}
