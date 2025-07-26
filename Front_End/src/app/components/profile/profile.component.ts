import { Component, OnInit } from '@angular/core';
import { ProfileService, employeeProfile } from '../../../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee: employeeProfile = {
    EMPLOYEE_ID: '',
    HONORIFICS: '',
    FIRST_NAME: '',
    LAST_NAME: '',
    DATE_OF_BIRTH: '',
    GENDER: '',
    NATIONALITY: '',
    COM_LANG: '',
    STREET: '',
    CITY: '',
    COUNTRY: '',
    EMPLOYEE_GRP: '',
    EMPLOYEE_SUBGRP: ''
  };

  honorifics: string = '';
  fullName: string = '';
  gendercheck: string = '';
  natioCheck: string = '';
  dob: string = '';
  language: string = '';

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const employeeID = localStorage.getItem('employeeID');
    console.log('Employee ID:', employeeID);

    if (!employeeID) {
      alert('No employee ID found. Redirecting to login.');
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.Profile(employeeID).subscribe({
      next: (data) => {
        this.employee = data;

        // Set honorific
        this.honorifics = this.employee.HONORIFICS === '1' ? 'Mr' : 'Ms';

        // Construct full name
        this.fullName = `${this.honorifics} ${this.employee.FIRST_NAME} ${this.employee.LAST_NAME}`.trim();

        // Determine gender
        if (this.employee.GENDER === '1' || this.honorifics === 'Mr') {
          this.gendercheck = 'Male';
        } else if (this.employee.GENDER === '2' || this.honorifics === 'Ms') {
          this.gendercheck = 'Female';
        } else {
          this.gendercheck = 'Prefer not to say';
        }

        // Nationality check
        this.natioCheck = this.employee.NATIONALITY || 'NIL';

        // Language check
        this.language = this.employee.COM_LANG === 'E' ? 'English' : this.employee.COM_LANG;

        // Format date of birth
        this.dob = this.employee.DATE_OF_BIRTH.split('-').reverse().join('-');
      },
      error: (err) => {
        console.error('Profile fetch failed:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashBoard']);
  }
}
