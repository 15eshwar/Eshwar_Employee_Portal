import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { payDetails, PayService } from '../../../services/payslip.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payslip',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './payslip.component.html',
  styleUrl: './payslip.component.css'
})
export class PayslipComponent implements OnInit {

  isLoading: boolean = true;
  isEmailSending: boolean = false; 
  noData: boolean = false;

  records: payDetails[] = [];

  showEmailPrompt: boolean = false;
  enteredEmail: string = '';
  pendingPernr: string = '';
  emailErrorMessage: string = '';
  emailStatusMessage: string = '';
  emailStatusType: 'success' | 'error' | '' = '';
  showStatus: boolean = false;

  constructor(private paySlipService: PayService, private router: Router) {}

  ngOnInit(): void {
    const employeeID = localStorage.getItem('employeeID');
    
    if (employeeID) {
      this.paySlipService.getpayDetails(employeeID).subscribe({
        next: (data) => {
          this.records = Array.isArray(data?.responseData) ? data.responseData : [data.responseData];
          this.noData = this.records.length === 0;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.noData = true;
        }
      });
    }
  }

  downloadPDF(pernr: string) {
    this.paySlipService.downloadInvoicePDF(pernr).subscribe({
      next: (pdfBlob: Blob) => {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `payslip_${pernr}.pdf`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      },
      error: () => {
        alert('Download failed. Check console for details.');
      }
    });
  }

  promptEmailAndSend(pernr: string) {
    this.pendingPernr = pernr;
    this.enteredEmail = '';
    this.showEmailPrompt = true;
  }

  cancelEmailPrompt() {
    this.showEmailPrompt = false;
    this.enteredEmail = '';
    this.pendingPernr = '';
    this.emailErrorMessage = '';
  }

  confirmEmailPrompt() {
    if (!this.enteredEmail || !this.enteredEmail.includes('@')) {
      this.emailErrorMessage = 'Please enter a valid email address.';
      return;
    }

    this.isEmailSending = true;
    this.sendEmail(this.pendingPernr, this.enteredEmail);
  }

  sendEmail(pernr: string, email: string) {
    const payload = { pernr, email };

    this.paySlipService.sendPayslipEmail(payload).subscribe({
      next: () => {
        this.emailStatusMessage = 'Payslip sent to your email';
        this.emailStatusType = 'success';
        this.showStatus = true;
      },
      error: (err) => {
        this.emailStatusMessage = `Failed to send payslip: ${err.error?.error || err.message}`;
        this.emailStatusType = 'error';
        this.showStatus = true;
      },
      complete: () => {
        this.isEmailSending = false; 
        this.showEmailPrompt = false;
        setTimeout(() => {
          this.showStatus = false;
        }, 7000);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashBoard']);
  }

  removeLeadingZeros(value: string | number): string {
    return value != null ? String(Number(value)) : '';
  }
}
