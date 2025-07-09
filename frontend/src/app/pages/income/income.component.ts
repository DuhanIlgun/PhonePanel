import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  incomes = [
    { id: 1, source: 'Telefon Satışı', amount: 2500, date: '2025-05-01', category: 'Satış' },
    { id: 2, source: 'Aksesuar Satışı', amount: 450, date: '2025-05-02', category: 'Aksesuar' },
    { id: 3, source: 'Servis ücreti', amount: 200, date: '2025-04-30', category: 'Servis' }
  ];

  incomeForm!: FormGroup;
  editingId: number | null = null;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  categories = ['Satış', 'Aksesuar', 'Servis', 'Diğer'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.incomeForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  addIncome(): void {
    if (this.incomeForm.invalid) {
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

    const newIncome = {
      id: this.incomes.length > 0 ? Math.max(...this.incomes.map(i => i.id)) + 1 : 1,
      ...this.incomeForm.value
    };

    this.incomes.unshift(newIncome);
    this.lastAddedId = newIncome.id;
    setTimeout(() => {
      this.lastAddedId = null;
    }, 2000);
    this.incomeForm.reset();

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Eklendi!',
      text: 'Gelir başarıyla eklendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteIncome(id: number): void {
    const selected = this.incomes.find(i => i.id === id);
    if (!selected) return;

    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: `${selected.source} - ₺${selected.amount} | Tarih: ${selected.date}`,
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
        this.incomes = this.incomes.filter(inc => inc.id !== id);

        Swal.fire({
          icon: 'success',
          iconHtml: '✔️',
          title: 'Silindi!',
          text: 'Gelir başarıyla silindi.',
          background: '#f1f8e9',
          color: '#33691e',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editIncome(income: any): void {
    this.editingId = income.id;
    this.incomeForm.setValue({
      source: income.source,
      amount: income.amount,
      date: income.date,
      category: income.category
    });
  }

  updateIncome(): void {
    if (this.incomeForm.invalid || this.editingId === null) {
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

    const index = this.incomes.findIndex(i => i.id === this.editingId);
    if (index !== -1) {
      this.incomes[index] = {
        id: this.editingId,
        ...this.incomeForm.value
      };
      this.lastUpdatedId = this.editingId;
      setTimeout(() => {
        this.lastUpdatedId = null;
      }, 2000);

      Swal.fire({
        icon: 'success',
        iconHtml: '🔄',
        title: 'Güncellendi!',
        text: 'Gelir başarıyla güncellendi.',
        background: '#e3f2fd',
        color: '#0d47a1',
        padding: '1.5em',
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.editingId = null;
    this.incomeForm.reset();
  }

  get filteredIncomes() {
    if (!this.searchTerm) return this.incomes;
    return this.incomes.filter(inc =>
      inc.source.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      inc.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredTotalAmount(): number {
    return this.filteredIncomes.reduce((sum, i) => sum + Number(i.amount), 0);
  }

  get totalAmount(): number {
    return this.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  }

  get monthlyAmount(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.incomes
      .filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
      })
      .reduce((sum, i) => sum + Number(i.amount), 0);
  }

  trackByIncome(index: number, income: any): number {
    return income.id;
  }

  sortBy(field: 'date' | 'amount'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.incomes.sort((a, b) => {
      const valA = field === 'amount' ? a.amount : new Date(a.date).getTime();
      const valB = field === 'amount' ? b.amount : new Date(b.date).getTime();
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }
} 