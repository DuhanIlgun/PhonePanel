import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  expenses = [
    { id: 1, name: 'Elektrik Faturası', amount: 1200, date: '2025-05-01' },
    { id: 2, name: 'Su Faturası', amount: 340, date: '2025-05-02' },
    { id: 3, name: 'Personel Maaşı', amount: 15000, date: '2025-04-30' }
  ];

  expenseForm!: FormGroup;
  editingId: number | null = null;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required]
    });


  }

  addExpense(): void {
    if (this.expenseForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm alanları doldurun.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em',
        customClass: {
          popup: 'my-swal-popup',
          confirmButton: 'my-confirm-button'
        }
      });
      return;
    }

    const newExpense = {
      id: this.expenses.length > 0 ? Math.max(...this.expenses.map(e => e.id)) + 1 : 1,
      ...this.expenseForm.value
    };

    this.expenses.unshift(newExpense);
    this.lastAddedId = newExpense.id;
    setTimeout(() => {
      this.lastAddedId = null;
    }, 2000);
    this.expenseForm.reset();
  

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Eklendi!',
      text: 'Gider başarıyla eklendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteExpense(id: number): void {
    const selected = this.expenses.find(e => e.id === id);
    if (!selected) return;

    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: `${selected.name} - ₺${selected.amount} | Tarih: ${selected.date}`,
      icon: 'error',
      iconHtml: '🗑️',
      background: '#ffebee',
      color: '#b71c1c',
      padding: '1.5em',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: '🗑️ Evet, sil',
      cancelButtonText: 'Vazgeç',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.expenses = this.expenses.filter(exp => exp.id !== id);
      

        Swal.fire({
          icon: 'success',
          iconHtml: '✔️',
          title: 'Silindi!',
          text: 'Gider başarıyla silindi.',
          background: '#f1f8e9',
          color: '#33691e',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editExpense(expense: any): void {
    this.editingId = expense.id;
    this.expenseForm.setValue({
      name: expense.name,
      amount: expense.amount,
      date: expense.date
    });
  }

  updateExpense(): void {
    if (this.expenseForm.invalid || this.editingId === null) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm alanları doldurun.',
        background: '#fff3e0',
        color: '#e65100',
        padding: '1.5em'
      });
      return;
    }

    const index = this.expenses.findIndex(e => e.id === this.editingId);
    if (index !== -1) {
      this.expenses[index] = {
        id: this.editingId,
        ...this.expenseForm.value
      };
      this.lastUpdatedId = this.editingId;
      setTimeout(() => {
        this.lastUpdatedId = null;
      }, 2000);
      

      Swal.fire({
        icon: 'success',
        iconHtml: '🔄',
        title: 'Güncellendi!',
        text: 'Gider başarıyla güncellendi.',
        background: '#e3f2fd',
        color: '#0d47a1',
        padding: '1.5em',
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.editingId = null;
    this.expenseForm.reset();
  }

  get filteredExpenses() {
    if (!this.searchTerm) return this.expenses;
    return this.expenses.filter(exp =>
      exp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredTotalAmount(): number {
    return this.filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  get totalAmount(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  get monthlyAmount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }

  trackByExpense(index: number, expense: any): number {
    return expense.id;
  }

  sortBy(field: 'date' | 'amount'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.expenses.sort((a, b) => {
      const valA = field === 'amount' ? a.amount : new Date(a.date).getTime();
      const valB = field === 'amount' ? b.amount : new Date(b.date).getTime();
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });

  
  }

  
}
