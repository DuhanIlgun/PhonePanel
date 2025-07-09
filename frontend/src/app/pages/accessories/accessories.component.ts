import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accessories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit {
  accessories = [
    { id: 1, name: 'iPhone Kılıfı', price: 150, stock: 25, category: 'Kılıf' },
    { id: 2, name: 'Samsung Kulaklık', price: 200, stock: 15, category: 'Kulaklık' },
    { id: 3, name: 'Şarj Kablosu', price: 50, stock: 40, category: 'Kablo' }
  ];

  accessoryForm!: FormGroup;
  editingId: number | null = null;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  categories = ['Kılıf', 'Kulaklık', 'Kablo', 'Şarj Aleti', 'Ekran Koruyucu', 'Diğer'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.accessoryForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  addAccessory(): void {
    if (this.accessoryForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm alanları doldurun.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    const newAccessory = {
      id: this.accessories.length > 0 ? Math.max(...this.accessories.map(a => a.id)) + 1 : 1,
      ...this.accessoryForm.value
    };

    this.accessories.unshift(newAccessory);
    this.lastAddedId = newAccessory.id;
    setTimeout(() => {
      this.lastAddedId = null;
    }, 2000);
    this.accessoryForm.reset();

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Eklendi!',
      text: 'Aksesuar başarıyla eklendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteAccessory(id: number): void {
    const selected = this.accessories.find(a => a.id === id);
    if (!selected) return;

    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: `${selected.name} - ₺${selected.price} | Stok: ${selected.stock}`,
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
        this.accessories = this.accessories.filter(acc => acc.id !== id);

        Swal.fire({
          icon: 'success',
          iconHtml: '✔️',
          title: 'Silindi!',
          text: 'Aksesuar başarıyla silindi.',
          background: '#f1f8e9',
          color: '#33691e',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editAccessory(accessory: any): void {
    this.editingId = accessory.id;
    this.accessoryForm.setValue({
      name: accessory.name,
      price: accessory.price,
      stock: accessory.stock,
      category: accessory.category
    });
  }

  updateAccessory(): void {
    if (this.accessoryForm.invalid || this.editingId === null) {
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

    const index = this.accessories.findIndex(a => a.id === this.editingId);
    if (index !== -1) {
      this.accessories[index] = {
        id: this.editingId,
        ...this.accessoryForm.value
      };
      this.lastUpdatedId = this.editingId;
      setTimeout(() => {
        this.lastUpdatedId = null;
      }, 2000);

      Swal.fire({
        icon: 'success',
        iconHtml: '🔄',
        title: 'Güncellendi!',
        text: 'Aksesuar başarıyla güncellendi.',
        background: '#e3f2fd',
        color: '#0d47a1',
        padding: '1.5em',
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.editingId = null;
    this.accessoryForm.reset();
  }

  get filteredAccessories() {
    if (!this.searchTerm) return this.accessories;
    return this.accessories.filter(acc =>
      acc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      acc.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get totalValue(): number {
    return this.accessories.reduce((sum, a) => sum + (a.price * a.stock), 0);
  }

  get totalItems(): number {
    return this.accessories.reduce((sum, a) => sum + a.stock, 0);
  }

  get filteredTotalValue(): number {
    return this.filteredAccessories.reduce((sum, a) => sum + (a.price * a.stock), 0);
  }

  trackByAccessory(index: number, accessory: any): number {
    return accessory.id;
  }

  sortBy(field: 'name' | 'price' | 'stock'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.accessories.sort((a, b) => {
      let valA: any = a[field];
      let valB: any = b[field];
      
      // String değerler için localeCompare kullan
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      // Sayısal değerler için normal çıkarma işlemi
      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }
} 