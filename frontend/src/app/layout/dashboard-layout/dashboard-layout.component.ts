import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss'
})
export class DashboardLayoutComponent {
    constructor(private router: Router) {}
    logout(){
      // Oturum bilgisini temizle (örnek: localStorage)
      localStorage.removeItem('user');
      // Login sayfasına yönlendir
      this.router.navigate(['/login']);
    }
    get userEmail(): string {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          return JSON.parse(user).email || 'Kullanıcı';
        } catch {
          return 'Kullanıcı';
        }
      }
      return 'Kullanıcı';
    }
}
