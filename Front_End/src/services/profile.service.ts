import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface employeeProfile {

    EMPLOYEE_ID: string,
    HONORIFICS: string,
    FIRST_NAME: string,
    LAST_NAME:string,
    DATE_OF_BIRTH:string,
    GENDER: string,
    NATIONALITY:string,
    COM_LANG: string,
    STREET:string,
    CITY:string,
    COUNTRY:string,
    EMPLOYEE_GRP:string,
    EMPLOYEE_SUBGRP:string
}

@Injectable({
providedIn: 'root',
})
export class ProfileService {

    constructor(private http: HttpClient) {}

    Profile(employeeID: string):
    Observable<employeeProfile> {
    return this.http.post<employeeProfile>(`http://localhost:3000/api/Profile/profile`, {
    employeeID
    });
}  
}