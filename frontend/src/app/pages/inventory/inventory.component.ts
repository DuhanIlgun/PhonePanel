import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventory = [
    { id: 1, name: 'iPhone 15 Pro', brand: 'Apple', model: '15 Pro', stock: 8, price: 45000, category: 'Telefon' },
    { id: 2, name: 'Samsung Galaxy S24', brand: 'Samsung', model: 'S24', stock: 12, price: 35000, category: 'Telefon' },
    { id: 3, name: 'Xiaomi Redmi Note 13', brand: 'Xiaomi', model: 'Note 13', stock: 15, price: 12000, category: 'Telefon' }
  ];

  inventoryForm!: FormGroup;
  editingId: number | null = null;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;
  searchTerm: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  categories = ['Telefon', 'Tablet', 'Laptop', 'Diğer'];
  brands = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'OnePlus', 'Diğer'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  addInventory(): void {
    if (this.inventoryForm.invalid) {
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

    const newItem = {
      id: this.inventory.length > 0 ? Math.max(...this.inventory.map(i => i.id)) + 1 : 1,
      ...this.inventoryForm.value
    };

    this.inventory.unshift(newItem);
    this.lastAddedId = newItem.id;
    setTimeout(() => {
      this.lastAddedId = null;
    }, 2000);
    this.inventoryForm.reset();

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Eklendi!',
      text: 'Ürün başarıyla eklendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteInventory(id: number): void {
    const selected = this.inventory.find(i => i.id === id);
    if (!selected) return;

    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: `${selected.brand} ${selected.name} - Stok: ${selected.stock}`,
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
        this.inventory = this.inventory.filter(item => item.id !== id);

        Swal.fire({
          icon: 'success',
          iconHtml: '✔️',
          title: 'Silindi!',
          text: 'Ürün başarıyla silindi.',
          background: '#f1f8e9',
          color: '#33691e',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editInventory(item: any): void {
    this.editingId = item.id;
    this.inventoryForm.setValue({
      name: item.name,
      brand: item.brand,
      model: item.model,
      stock: item.stock,
      price: item.price,
      category: item.category
    });
  }

  updateInventory(): void {
    if (this.inventoryForm.invalid || this.editingId === null) {
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

    const index = this.inventory.findIndex(i => i.id === this.editingId);
    if (index !== -1) {
      this.inventory[index] = {
        id: this.editingId,
        ...this.inventoryForm.value
      };
      this.lastUpdatedId = this.editingId;
      setTimeout(() => {
        this.lastUpdatedId = null;
      }, 2000);

      Swal.fire({
        icon: 'success',
        iconHtml: '🔄',
        title: 'Güncellendi!',
        text: 'Ürün başarıyla güncellendi.',
        background: '#e3f2fd',
        color: '#0d47a1',
        padding: '1.5em',
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.editingId = null;
    this.inventoryForm.reset();
  }

  get filteredInventory() {
    if (!this.searchTerm) return this.inventory;
    return this.inventory.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get totalValue(): number {
    return this.inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  }

  get totalItems(): number {
    return this.inventory.reduce((sum, item) => sum + item.stock, 0);
  }

  get lowStockItems(): number {
    return this.inventory.filter(item => item.stock < 5).length;
  }

  get filteredTotalValue(): number {
    return this.filteredInventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
  }

  trackByInventory(index: number, item: any): number {
    return item.id;
  }

  sortBy(field: 'name' | 'brand' | 'price' | 'stock'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.inventory.sort((a, b) => {
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