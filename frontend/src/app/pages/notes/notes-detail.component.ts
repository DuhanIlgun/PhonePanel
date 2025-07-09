import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-notes-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-detail.component.html',
  styleUrls: ['./notes-detail.component.scss']
})
export class NotesDetailComponent {
  // Örnek veriler
  lastMonthNotes = [
    { title: 'Kasa sayımı yapıldı', date: '2025-05-01' },
    { title: 'Yeni aksesuar siparişi verildi', date: '2025-05-03' },
    { title: 'Personel toplantısı', date: '2025-05-07' },
    { title: 'Kira ödendi', date: '2025-05-10' },
    { title: 'Stok güncellendi', date: '2025-05-15' }
  ];

  get total(): number {
    return this.lastMonthNotes.length;
  }

  get latestNote() {
    return this.lastMonthNotes[0];
  }
} 