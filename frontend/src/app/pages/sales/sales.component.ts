import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { IncomeService } from '../income/income.service';

interface Sale {
  id: number;
  date: string;
  customer: string;
  customerPhone: string;
  products: string;
  quantity: number;
  total: number;
  payment: string;
  staff: string;
  status: 'Tamamlandı' | 'İade' | 'Bekliyor';
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent {
  displayedColumns: string[] = [
    'id', 'date', 'customer', 'customerPhone', 'products', 'quantity', 'total', 'payment', 'staff', 'status', 'actions'
  ];
  sales: Sale[] = [
    {
      id: 1001,
      date: '2025-05-20',
      customer: 'Ahmet Yılmaz',
      customerPhone: '0555 111 22 33',
      products: 'iPhone 15 Pro, Kılıf',
      quantity: 2,
      total: 48000,
      payment: 'Nakit',
      staff: 'Zeynep',
      status: 'Tamamlandı'
    },
    {
      id: 1002,
      date: '2025-05-19',
      customer: 'Mehmet Demir',
      customerPhone: '0532 222 33 44',
      products: 'Samsung S24',
      quantity: 1,
      total: 35000,
      payment: 'Kredi Kartı',
      staff: 'Ali',
      status: 'Bekliyor'
    },
    {
      id: 1003,
      date: '2025-05-18',
      customer: 'Ayşe Kaya',
      customerPhone: '0543 333 44 55',
      products: 'Redmi Note 13, Şarj Kablosu',
      quantity: 2,
      total: 12500,
      payment: 'Havale',
      staff: 'Zeynep',
      status: 'İade'
    }
  ];
  filterValue: string = '';
  statusFilter: string = '';
  // Satış ekleme/düzenleme için form state
  newSale: Partial<Sale> = {};
  editingSale: Sale | null = null;
  showSaleForm: boolean = false;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;

  constructor(public incomeService: IncomeService) {}

  get filteredSales(): Sale[] {
    let filtered = this.sales;
    if (this.filterValue) {
      const val = this.filterValue.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.customer.toLowerCase().includes(val) ||
        sale.customerPhone.toLowerCase().includes(val) ||
        sale.products.toLowerCase().includes(val) ||
        sale.staff.toLowerCase().includes(val) ||
        sale.id.toString().includes(val)
      );
    }
    if (this.statusFilter) {
      filtered = filtered.filter(sale => sale.status === this.statusFilter);
    }
    return filtered;
  }

  get totalSalesAmount(): number {
    return this.sales.reduce((sum, sale) => sum + sale.total, 0);
  }

  get completedSalesCount(): number {
    return this.sales.filter(sale => sale.status === 'Tamamlandı').length;
  }

  get pendingSalesCount(): number {
    return this.sales.filter(sale => sale.status === 'Bekliyor').length;
  }

  get filteredTotalAmount(): number {
    return this.filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  }

  trackBySale(index: number, sale: Sale): number {
    return sale.id;
  }

  openSaleForm(sale?: Sale) {
    if (sale) {
      this.editingSale = { ...sale };
      this.newSale = { ...sale };
    } else {
      this.editingSale = null;
      this.newSale = {};
    }
    this.showSaleForm = true;
  }

  closeSaleForm() {
    this.showSaleForm = false;
    this.newSale = {};
    this.editingSale = null;
  }

  saveSale() {
    if (!this.newSale.customer || !this.newSale.customerPhone || !this.newSale.products || !this.newSale.quantity || !this.newSale.total || !this.newSale.payment || !this.newSale.staff || !this.newSale.status) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    if (this.editingSale) {
      // Düzenleme
      const idx = this.sales.findIndex(s => s.id === this.editingSale!.id);
      if (idx > -1) {
        this.sales[idx] = { ...this.editingSale, ...this.newSale } as Sale;
        this.lastUpdatedId = this.editingSale.id;
        setTimeout(() => {
          this.lastUpdatedId = null;
        }, 2000);
      }
    } else {
      // Ekleme
      const newId = this.sales.length > 0 ? Math.max(...this.sales.map(s => s.id)) + 1 : 1001;
      const sale: Sale = { ...this.newSale, id: newId, date: new Date().toISOString().slice(0, 10) } as Sale;
      this.sales.unshift(sale);
      this.lastAddedId = sale.id;
      setTimeout(() => {
        this.lastAddedId = null;
      }, 2000);
      // Satıştan gelir ekle
      this.incomeService.addIncomeFromSale(sale);
    }
    this.closeSaleForm();
  }

  deleteSale(sale: Sale) {
    if (confirm('Satışı silmek istediğinize emin misiniz?')) {
      this.sales = this.sales.filter(s => s.id !== sale.id);
      // İlgili geliri de sil
      this.incomeService.removeIncomeFromSale(sale.id);
    }
  }
}
