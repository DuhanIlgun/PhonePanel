import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.scss']
})
export class SalesDetailComponent {
  // Örnek veriler
  lastMonthSales = [
    { name: 'iPhone 15 Pro', amount: 45000 },
    { name: 'Samsung S24', amount: 35000 },
    { name: 'Redmi Note 13', amount: 12000 },
    { name: 'Aksesuar Satışı', amount: 3000 },
    { name: 'Tablet Satışı', amount: 8000 }
  ];

  get total(): number {
    return this.lastMonthSales.reduce((sum, s) => sum + s.amount, 0);
  }

  get maxSale() {
    return this.lastMonthSales.reduce((prev, curr) => prev.amount > curr.amount ? prev : curr);
  }

  get minSale() {
    return this.lastMonthSales.reduce((prev, curr) => prev.amount < curr.amount ? prev : curr);
  }
} 