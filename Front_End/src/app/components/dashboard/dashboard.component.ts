import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  showDropdown = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 0) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  Dropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goWelcome() {
    this.router.navigate(['/welcome']);
  }

  goLogout() {
    this.router.navigate(['/login']);
  }

  goAbout() {
    this.router.navigate(['/about']);
  }

  goContact() {
    this.router.navigate(['/contact']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  goleavedata() {
    this.router.navigate(['/leave-data']);
  }

  goPayslip() {
    this.router.navigate(['/pay-slip']);
  }
}
