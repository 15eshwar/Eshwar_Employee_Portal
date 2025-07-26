import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
status:string,
message:string
}

@Injectable({
providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) {}

    login(employeeID: string, password: string):
    Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
    employeeID,
    password,
    });
}  
}