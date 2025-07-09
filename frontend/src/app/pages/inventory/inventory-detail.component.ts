import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent {
  // Örnek veriler
  inventory = [
    { name: 'iPhone 15 Pro', stock: 8 },
    { name: 'Samsung S24', stock: 12 },
    { name: 'Redmi Note 13', stock: 15 },
    { name: 'Kılıf', stock: 40 },
    { name: 'Şarj Kablosu', stock: 30 }
  ];

  get total(): number {
    return this.inventory.reduce((sum, i) => sum + i.stock, 0);
  }

  get maxStock() {
    return this.inventory.reduce((prev, curr) => prev.stock > curr.stock ? prev : curr);
  }

  get minStock() {
    return this.inventory.reduce((prev, curr) => prev.stock < curr.stock ? prev : curr);
  }
} 