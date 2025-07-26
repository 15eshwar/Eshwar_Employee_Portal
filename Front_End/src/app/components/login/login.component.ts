import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  employeeID: string = '';
  password: string = '';
  showError: boolean = false;
  loginMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.login();
    this.employeeID = '';
    this.password = '';
  }

  login(): void {
    const employeeID = this.employeeID;
    const password = this.password;

    console.log('Login button clicked');

    if (!employeeID || !password) {
      console.warn('Vendor ID or Password is missing.');
      return;
    }

    this.authService.login(employeeID, password).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        this.loginMessage = res.message;

        if (res.status === 'S') {
          console.log('Navigation to /home triggered');
          this.router.navigate(['/dashBoard']);
        } else {
          this.showError = true;
        }
      },
      error: (err) => {
        this.loginMessage = 'Login failed. Try again.';
        console.error(err);
      }
    });

    localStorage.setItem('employeeID', employeeID);
  }

  goWelcome() {
    this.router.navigate(['/welcome']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goAbout() {
    this.router.navigate(['/about']);
  }

  goContact() {
    this.router.navigate(['/contact']);
  }

  goBack() {
    this.router.navigate(['/welcome']);
  }
}
