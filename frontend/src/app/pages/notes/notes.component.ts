import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  tag: 'Bilgi' | 'Uyarı' | 'Kritik' | 'Alacak' | 'Verecek';
  reminderDate?: Date;
  isCompleted?: boolean;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [
    {
      id: 1,
      title: 'Önemli Toplantı',
      content: 'Yarın saat 14:00\'da müşteri ile toplantı var. Sunum hazırlanmalı.',
      createdAt: new Date('2024-01-15'),
      tag: 'Kritik',
      reminderDate: new Date('2024-01-16T14:00:00')
    },
    {
      id: 2,
      title: 'Alacak Takibi',
      content: 'ABC Şirketi\'nden 15.000₺ alacak var. 30 gün içinde tahsil edilmeli.',
      createdAt: new Date('2024-01-14'),
      tag: 'Alacak',
      reminderDate: new Date('2024-02-14T09:00:00')
    },
    {
      id: 3,
      title: 'Stok Kontrolü',
      content: 'iPhone 15 Pro stokları azalıyor. Sipariş verilmeli.',
      createdAt: new Date('2024-01-13'),
      tag: 'Uyarı'
    },
    {
      id: 4,
      title: 'Fatura Ödemesi',
      content: 'Elektrik faturası 500₺ - 25 Ocak\'a kadar ödenmeli.',
      createdAt: new Date('2024-01-12'),
      tag: 'Verecek',
      reminderDate: new Date('2024-01-25T17:00:00')
    },
    {
      id: 5,
      title: 'Sistem Güncellemesi',
      content: 'Yazılım güncellemesi yapılacak. Yedek alınmalı.',
      createdAt: new Date('2024-01-11'),
      tag: 'Bilgi'
    }
  ];

  noteForm!: FormGroup;
  editingId: number | null = null;
  lastAddedId: number | null = null;
  lastUpdatedId: number | null = null;
  searchTerm: string = '';
  sortField: string = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  selectedTag: string = '';
  showRemindersOnly: boolean = false;

  tags = ['Bilgi', 'Uyarı', 'Kritik', 'Alacak', 'Verecek'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tag: ['', Validators.required],
      reminderDate: [''],
      reminderTime: ['']
    });
  }

  addNote(): void {
    if (this.noteForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen başlık, içerik ve etiket alanlarını doldurun.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    const formValue = this.noteForm.value;
    let reminderDate: Date | undefined;

    if (formValue.reminderDate && formValue.reminderTime) {
      const date = new Date(formValue.reminderDate);
      const [hours, minutes] = formValue.reminderTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      reminderDate = date;
    }

    const newNote: Note = {
      id: this.notes.length > 0 ? Math.max(...this.notes.map(n => n.id)) + 1 : 1,
      title: formValue.title,
      content: formValue.content,
      createdAt: new Date(),
      tag: formValue.tag,
      reminderDate: reminderDate,
      isCompleted: false
    };

    this.notes.unshift(newNote);
    this.lastAddedId = newNote.id;
    setTimeout(() => {
      this.lastAddedId = null;
    }, 2000);
    this.noteForm.reset();

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Eklendi!',
      text: 'Not başarıyla eklendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteNote(id: number): void {
    const selected = this.notes.find(n => n.id === id);
    if (!selected) return;

    Swal.fire({
      title: 'Silmek istediğinize emin misiniz?',
      text: `${selected.title}`,
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
        this.notes = this.notes.filter(note => note.id !== id);

        Swal.fire({
          icon: 'success',
          iconHtml: '✔️',
          title: 'Silindi!',
          text: 'Not başarıyla silindi.',
          background: '#f1f8e9',
          color: '#33691e',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  editNote(note: Note): void {
    this.editingId = note.id;
    
    let reminderDate = '';
    let reminderTime = '';
    
    if (note.reminderDate) {
      const date = new Date(note.reminderDate);
      reminderDate = date.toISOString().split('T')[0];
      reminderTime = date.toTimeString().slice(0, 5);
    }

    this.noteForm.setValue({
      title: note.title,
      content: note.content,
      tag: note.tag,
      reminderDate: reminderDate,
      reminderTime: reminderTime
    });
  }

  updateNote(): void {
    if (this.noteForm.invalid || this.editingId === null) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen başlık, içerik ve etiket alanlarını doldurun.',
        background: '#fff3e0',
        color: '#e65100',
        padding: '1.5em'
      });
      return;
    }

    const formValue = this.noteForm.value;
    let reminderDate: Date | undefined;

    if (formValue.reminderDate && formValue.reminderTime) {
      const date = new Date(formValue.reminderDate);
      const [hours, minutes] = formValue.reminderTime.split(':');
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      reminderDate = date;
    }

    const index = this.notes.findIndex(n => n.id === this.editingId);
    if (index !== -1) {
      this.notes[index] = {
        ...this.notes[index],
        title: formValue.title,
        content: formValue.content,
        tag: formValue.tag,
        reminderDate: reminderDate
      };
      this.lastUpdatedId = this.editingId;
      setTimeout(() => {
        this.lastUpdatedId = null;
      }, 2000);

      Swal.fire({
        icon: 'success',
        iconHtml: '🔄',
        title: 'Güncellendi!',
        text: 'Not başarıyla güncellendi.',
        background: '#e3f2fd',
        color: '#0d47a1',
        padding: '1.5em',
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.editingId = null;
    this.noteForm.reset();
  }

  toggleReminder(note: Note): void {
    note.isCompleted = !note.isCompleted;
  }

  get filteredNotes() {
    let filtered = this.notes;

    // Arama filtresi
    if (this.searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Etiket filtresi
    if (this.selectedTag) {
      filtered = filtered.filter(note => note.tag === this.selectedTag);
    }

    // Sadece hatırlatmalı notlar
    if (this.showRemindersOnly) {
      filtered = filtered.filter(note => note.reminderDate);
    }

    return filtered;
  }

  get sortedNotes() {
    const filtered = this.filteredNotes;
    
    // Hatırlatma tarihi gelen notları üstte göster
    const now = new Date();
    const withReminders = filtered.filter(note => 
      note.reminderDate && new Date(note.reminderDate) <= now && !note.isCompleted
    );
    const withoutReminders = filtered.filter(note => 
      !note.reminderDate || new Date(note.reminderDate) > now || note.isCompleted
    );

    // Sıralama
    const sortNotes = (notes: Note[]) => {
      return notes.sort((a, b) => {
        let valA: any = a[this.sortField as keyof Note];
        let valB: any = b[this.sortField as keyof Note];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return this.sortDirection === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        }
        
        if (valA instanceof Date && valB instanceof Date) {
          return this.sortDirection === 'asc' 
            ? valA.getTime() - valB.getTime() 
            : valB.getTime() - valA.getTime();
        }
        
        return this.sortDirection === 'asc' ? valA - valB : valB - valA;
      });
    };

    return [...sortNotes(withReminders), ...sortNotes(withoutReminders)];
  }

  get totalNotes(): number {
    return this.notes.length;
  }

  get reminderNotes(): number {
    return this.notes.filter(note => note.reminderDate).length;
  }

  get overdueReminders(): number {
    const now = new Date();
    return this.notes.filter(note => 
      note.reminderDate && new Date(note.reminderDate) <= now && !note.isCompleted
    ).length;
  }

  get filteredTotalValue(): number {
    return this.filteredNotes.length;
  }

  trackByNote(index: number, note: Note): number {
    return note.id;
  }

  sortBy(field: 'title' | 'createdAt' | 'tag'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedTag = '';
    this.showRemindersOnly = false;
  }

  isOverdue(note: Note): boolean {
    if (!note.reminderDate) return false;
    return new Date(note.reminderDate) <= new Date() && !note.isCompleted;
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'Bilgi': return 'info-gradient';
      case 'Uyarı': return 'warning-gradient';
      case 'Kritik': return 'danger-gradient';
      case 'Alacak': return 'success-gradient';
      case 'Verecek': return 'primary-gradient';
      default: return 'info-gradient';
    }
  }

  getTagIcon(tag: string): string {
    switch (tag) {
      case 'Bilgi': return 'fas fa-info-circle';
      case 'Uyarı': return 'fas fa-exclamation-triangle';
      case 'Kritik': return 'fas fa-exclamation-circle';
      case 'Alacak': return 'fas fa-hand-holding-usd';
      case 'Verecek': return 'fas fa-credit-card';
      default: return 'fas fa-tag';
    }
  }
} 