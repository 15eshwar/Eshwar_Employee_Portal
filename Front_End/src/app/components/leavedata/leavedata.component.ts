import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { leavedataService, leavedata } from '../../../services/leavedata.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ld',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leavedata.component.html',
  styleUrls: ['./leavedata.component.css']
})
export class LeavedataComponent implements OnInit {

  isLoading: boolean = true;
  noData: boolean = false;

  ldata: leavedata[] = [];
  originalData: leavedata[] = [];

  sortField: string = 'START_DATE';
  filterField: string = 'START_DATE';
  filterText: string = '';

  constructor(private leaveDataservice: leavedataService,private router: Router) {}

  ngOnInit(): void {
    const employeeID = localStorage.getItem('employeeID');
    if (employeeID) {
      this.leaveDataservice.ld(employeeID).subscribe({
        next: (data) => {
          console.log('API response:', data);
          const cleaned = (data?.leaveData ?? []).filter(item => item != null);
          this.ldata = [...cleaned];
          this.originalData = [...cleaned];
          this.noData = !this.ldata.length;
          this.isLoading = false;
          this.sortData(); 
        },
        error: (error) => {
          console.error('Error fetching data:', error);
          this.ldata = [];
          this.originalData = [];
          this.isLoading = false;
          this.noData = true;
        }
      });
    }
  }

  sortData(): void {
    if (!this.sortField || this.ldata.length === 0) return;
    this.ldata.sort((a: any, b: any) => {
      const valueA = a[this.sortField];
      const valueB = b[this.sortField];

      if (this.sortField.includes('DATE')) {
        return new Date(valueA).getTime() - new Date(valueB).getTime();
      } else {
        const numA = parseFloat(valueA) || 0;
        const numB = parseFloat(valueB) || 0;
        return numA - numB;
      }
    });
  }

  isFieldVisible(fieldName: string): boolean {
    return this.filterField === fieldName;
  }
  searchFilteredData(): void {
    const keyword = this.filterText.trim().toLowerCase();
    if (!keyword) {
      this.ldata = [...this.originalData];
      return;
    }
    this.ldata = this.originalData.filter(item => {
      const fieldValue = ((item as any)[this.filterField] || '').toString().toLowerCase().trim();
      return fieldValue === keyword;
    });
    this.noData = this.ldata.length === 0;
  }
  refreshData(): void {
  this.filterText = '';
  this.filterField = 'START_DATE'; 
  this.ldata = [...this.originalData];
  }
  goBack(): void {
    this.router.navigate(['/dashBoard']);
  }
  removeLeadingZeros(value: string | number): string {
  return value != null ? String(Number(value)) : '';
  }
  formatDateToDMY(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  }
}