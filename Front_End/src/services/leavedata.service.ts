import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface leavedata {
    EMPLOYEE_ID: string,
    FIRST_NAME: string,
    LAST_NAME:string,
    PRAB_TYPE:string,
    START_DATE: string,
    END_DATE:string,
    NO_OF_PRAB: string,
    ABSENCE_HOURS:string,
    PAYROLL_DAYS:string,
    PAYROLL_HOURS:string,
    NO_OF_ETIMEQ:string,
    COUNTER_TIMERQ:string,
    ABSENCE_QTYPE:string,
    START_DATE_QDEDUCT:string,
}
@Injectable({
  providedIn: 'root',
})
export class leavedataService {
  constructor(private http: HttpClient) {}

  ld(employeeID: string): Observable<{ leaveData: leavedata[] }> {
    return this.http.post<{ leaveData: leavedata[] }>(
      `http://localhost:3000/api/leaveData/ld`,{employeeID}
    );
  }
}