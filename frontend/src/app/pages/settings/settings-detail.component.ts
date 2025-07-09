import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-detail.component.html',
  styleUrls: ['./settings-detail.component.scss']
})
export class SettingsDetailComponent {
  // Örnek veriler
  lastMonthSettings = [
    { action: 'Şifre değiştirildi', date: '2025-05-02' },
    { action: 'Kullanıcı eklendi', date: '2025-05-05' },
    { action: 'Bildirimler açıldı', date: '2025-05-12' },
    { action: 'Tema değiştirildi', date: '2025-05-18' }
  ];

  get total(): number {
    return this.lastMonthSettings.length;
  }

  get latestSetting() {
    return this.lastMonthSettings[0];
  }
} 