import { Injectable } from '@angular/core';

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
  category: string;
  fromSaleId?: number; // Satıştan geldiyse satış ID'si
}

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private incomes: Income[] = [
    { id: 1, source: 'Telefon Satışı', amount: 2500, date: '2025-05-01', category: 'Satış' },
    { id: 2, source: 'Aksesuar Satışı', amount: 450, date: '2025-05-02', category: 'Aksesuar' },
    { id: 3, source: 'Servis ücreti', amount: 200, date: '2025-04-30', category: 'Servis' }
  ];

  getIncomes() {
    return this.incomes;
  }

  addIncome(income: Income) {
    this.incomes.unshift(income);
  }

  addIncomeFromSale(sale: { id: number; total: number; date: string; customer: string; }) {
    const newIncome: Income = {
      id: this.incomes.length > 0 ? Math.max(...this.incomes.map(i => i.id)) + 1 : 1,
      source: `Satış: ${sale.customer}`,
      amount: sale.total,
      date: sale.date,
      category: 'Satış',
      fromSaleId: sale.id
    };
    this.addIncome(newIncome);
  }

  removeIncomeFromSale(saleId: number) {
    this.incomes = this.incomes.filter(i => i.fromSaleId !== saleId);
  }

  deleteIncome(id: number) {
    this.incomes = this.incomes.filter(i => i.id !== id);
  }
} 