import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface payDetails {
     PERNR: string;
     TRFAR: string;
     TRFGB: string;
     TRFGR: string;
     TRFST: string;
     WAERS: string;
     BSGRD: string;
     DIVGV: string;
     ANSAL: string;
}
@Injectable({
  providedIn: 'root'
})

export class PayService {
 
  constructor(private http: HttpClient) {}

  getpayDetails(employeeID: string): Observable<{ responseData : payDetails[] }> {
    return this.http.post<{responseData : payDetails[] }>(`http://localhost:3000/api/psd/PSD`,
       {employeeID}
    );     
  }

downloadInvoicePDF(pernr: string): Observable<Blob> {
  return this.http.post(
    'http://localhost:3000/api/payslip/payslip-download',
    { pernr : pernr },
    { responseType: 'blob' } // blob
  );
}

sendPayslipEmail(payload: { pernr: string; email: string }): Observable<any> {
  const url = `http://localhost:3000/api/payslipMail/send-payslip-mail`;
  return this.http.post(url, payload);
}


}
