import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accessories-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accessories-detail.component.html',
  styleUrls: ['./accessories-detail.component.scss']
})
export class AccessoriesDetailComponent {
  // Örnek veriler
  lastMonthAccessories = [
    { name: 'iPhone Kılıfı', price: 150, stock: 25 },
    { name: 'Samsung Kulaklık', price: 200, stock: 15 },
    { name: 'Şarj Kablosu', price: 50, stock: 40 },
    { name: 'Ekran Koruyucu', price: 80, stock: 30 },
    { name: 'Bluetooth Hoparlör', price: 350, stock: 8 }
  ];

  get totalValue(): number {
    return this.lastMonthAccessories.reduce((sum, a) => sum + a.price * a.stock, 0);
  }

  get maxStock() {
    return this.lastMonthAccessories.reduce((prev, curr) => prev.stock > curr.stock ? prev : curr);
  }

  get minStock() {
    return this.lastMonthAccessories.reduce((prev, curr) => prev.stock < curr.stock ? prev : curr);
  }
} 