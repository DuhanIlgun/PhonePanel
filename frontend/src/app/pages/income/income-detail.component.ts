import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-income-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './income-detail.component.html',
  styleUrls: ['./income-detail.component.scss']
})
export class IncomeDetailComponent {
  // Örnek veriler
  lastMonthIncomes = [
    { source: 'Telefon Satışı', amount: 2500 },
    { source: 'Aksesuar Satışı', amount: 450 },
    { source: 'Servis Ücreti', amount: 200 },
    { source: 'Tablet Satışı', amount: 1200 },
    { source: 'Laptop Satışı', amount: 3000 },
    { source: 'Kasa Satışı', amount: 800 }
  ];

  get total(): number {
    return this.lastMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  }

  get maxIncome() {
    return this.lastMonthIncomes.reduce((prev, curr) => prev.amount > curr.amount ? prev : curr);
  }

  get minIncome() {
    return this.lastMonthIncomes.reduce((prev, curr) => prev.amount < curr.amount ? prev : curr);
  }
} 