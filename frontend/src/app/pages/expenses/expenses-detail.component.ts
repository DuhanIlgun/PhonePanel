import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-expenses-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expenses-detail.component.html',
  styleUrls: ['./expenses-detail.component.scss']
})
export class ExpensesDetailComponent {
  // Örnek veriler
  lastMonthExpenses = [
    { name: 'Elektrik', amount: 1200 },
    { name: 'Su', amount: 340 },
    { name: 'Personel Maaşı', amount: 15000 },
    { name: 'Kira', amount: 5000 },
    { name: 'Temizlik', amount: 800 },
    { name: 'İnternet', amount: 400 }
  ];

  get total(): number {
    return this.lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }

  get maxExpense() {
    return this.lastMonthExpenses.reduce((prev, curr) => prev.amount > curr.amount ? prev : curr);
  }

  get minExpense() {
    return this.lastMonthExpenses.reduce((prev, curr) => prev.amount < curr.amount ? prev : curr);
  }
} 