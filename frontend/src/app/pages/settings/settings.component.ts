import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import Swal from 'sweetalert2';

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  emailNotifications: boolean;
  dailyReminders: boolean;
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userSettings: UserSettings = {
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    emailNotifications: true,
    dailyReminders: false,
    theme: 'light',
    language: 'tr'
  };

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  settingsForm!: FormGroup;
  isPasswordFormValid: boolean = false;

  themes: { value: 'light' | 'dark', label: string, icon: string }[] = [
    { value: 'light', label: 'Açık Tema', icon: 'fas fa-sun' },
    { value: 'dark', label: 'Koyu Tema', icon: 'fas fa-moon' }
  ];

  languages: { value: 'tr' | 'en', label: string, icon: string }[] = [
    { value: 'tr', label: 'Türkçe', icon: '🇹🇷' },
    { value: 'en', label: 'English', icon: '🇺🇸' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.initPasswordForm();
    this.initSettingsForm();
  }

  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      firstName: [this.userSettings.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userSettings.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userSettings.email, [Validators.required, Validators.email]]
    });
  }

  private initPasswordForm(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), this.passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Şifre formunun geçerliliğini takip et
    this.passwordForm.valueChanges.subscribe(() => {
      this.isPasswordFormValid = this.passwordForm.valid;
    });
  }

  private initSettingsForm(): void {
    this.settingsForm = this.fb.group({
      emailNotifications: [this.userSettings.emailNotifications],
      dailyReminders: [this.userSettings.dailyReminders],
      theme: [this.userSettings.theme, Validators.required],
      language: [this.userSettings.language, Validators.required]
    });
  }

  // Şifre güçlülük kontrolü
  private passwordStrengthValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const errors: ValidationErrors = {};

      if (!hasUpperCase) errors['noUpperCase'] = true;
      if (!hasLowerCase) errors['noLowerCase'] = true;
      if (!hasNumbers) errors['noNumbers'] = true;
      if (!hasSpecialChar) errors['noSpecialChar'] = true;

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  // Şifre eşleşme kontrolü
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  // Profil bilgilerini güncelle
  updateProfile(): void {
    if (this.profileForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm alanları doğru şekilde doldurun.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    const formValue = this.profileForm.value;
    this.userSettings = { ...this.userSettings, ...formValue };

    Swal.fire({
      icon: 'success',
      iconHtml: '✅',
      title: 'Güncellendi!',
      text: 'Profil bilgileriniz başarıyla güncellendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Şifre değiştir
  updatePassword(): void {
    if (this.passwordForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm şifre alanlarını doğru şekilde doldurun.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    const formValue = this.passwordForm.value;

    // Şifre güçlülük kontrolü
    const passwordErrors = this.passwordForm.get('newPassword')?.errors;
    if (passwordErrors) {
      let errorMessage = 'Şifre aşağıdaki kriterleri karşılamalıdır:\n';
      if (passwordErrors['noUpperCase']) errorMessage += '• En az bir büyük harf\n';
      if (passwordErrors['noLowerCase']) errorMessage += '• En az bir küçük harf\n';
      if (passwordErrors['noNumbers']) errorMessage += '• En az bir rakam\n';
      if (passwordErrors['noSpecialChar']) errorMessage += '• En az bir özel karakter\n';

      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Şifre Güvenliği',
        text: errorMessage,
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    // Şifre eşleşme kontrolü
    if (formValue.newPassword !== formValue.confirmPassword) {
      Swal.fire({
        icon: 'error',
        iconHtml: '❌',
        title: 'Şifre Uyuşmazlığı',
        text: 'Yeni şifreler eşleşmiyor.',
        background: '#ffebee',
        color: '#b71c1c',
        padding: '1.5em'
      });
      return;
    }

    // Şifre değiştirme işlemi simülasyonu
    Swal.fire({
      icon: 'success',
      iconHtml: '🔐',
      title: 'Şifre Değiştirildi!',
      text: 'Şifreniz başarıyla güncellendi.',
      background: '#e8f5e9',
      color: '#1b5e20',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });

    this.passwordForm.reset();
    this.isPasswordFormValid = false;
  }

  // Ayarları güncelle
  updateSettings(): void {
    if (this.settingsForm.invalid) {
      Swal.fire({
        icon: 'warning',
        iconHtml: '⚠️',
        title: 'Eksik Bilgi',
        text: 'Lütfen tüm ayarları seçin.',
        background: '#fffbea',
        color: '#665c00',
        padding: '1.5em'
      });
      return;
    }

    const formValue = this.settingsForm.value;
    this.userSettings = { ...this.userSettings, ...formValue };

    Swal.fire({
      icon: 'success',
      iconHtml: '⚙️',
      title: 'Ayarlar Güncellendi!',
      text: 'Ayarlarınız başarıyla kaydedildi.',
      background: '#e3f2fd',
      color: '#0d47a1',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Şifre güçlülük seviyesini hesapla
  getPasswordStrength(): { level: number; label: string; color: string } {
    const password = this.passwordForm.get('newPassword')?.value;
    if (!password) return { level: 0, label: 'Şifre girin', color: '#e0e0e0' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { label: 'Çok Zayıf', color: '#ff6b6b' },
      { label: 'Zayıf', color: '#ffa726' },
      { label: 'Orta', color: '#ffd54f' },
      { label: 'Güçlü', color: '#66bb6a' },
      { label: 'Çok Güçlü', color: '#43a047' }
    ];

    return { level: strength, ...levels[strength - 1] };
  }

  // Şifre güçlülük yüzdesini hesapla
  getPasswordStrengthPercentage(): number {
    return (this.getPasswordStrength().level / 5) * 100;
  }

  // Form geçerlilik kontrolleri
  get isProfileFormValid(): boolean {
    return this.profileForm.valid;
  }

  get isSettingsFormValid(): boolean {
    return this.settingsForm.valid;
  }

  // Şifre gereksinimleri kontrol metodları
  hasUpperCase(): boolean {
    const password = this.passwordForm.get('newPassword')?.value;
    return password ? /[A-Z]/.test(password) : false;
  }

  hasLowerCase(): boolean {
    const password = this.passwordForm.get('newPassword')?.value;
    return password ? /[a-z]/.test(password) : false;
  }

  hasNumbers(): boolean {
    const password = this.passwordForm.get('newPassword')?.value;
    return password ? /\d/.test(password) : false;
  }

  hasSpecialChar(): boolean {
    const password = this.passwordForm.get('newPassword')?.value;
    return password ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : false;
  }

  // Tema değiştirme
  changeTheme(theme: 'light' | 'dark'): void {
    this.settingsForm.patchValue({ theme });
    this.userSettings.theme = theme;
    
    // Tema değişikliği animasyonu
    document.body.style.transition = 'all 0.3s ease';
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#333333';
    }
  }

  // Dil değiştirme
  changeLanguage(language: 'tr' | 'en'): void {
    this.settingsForm.patchValue({ language });
    this.userSettings.language = language;
    
    Swal.fire({
      icon: 'info',
      iconHtml: '🌍',
      title: 'Dil Değiştirildi',
      text: `Dil ${language === 'tr' ? 'Türkçe' : 'İngilizce'} olarak ayarlandı.`,
      background: '#e3f2fd',
      color: '#0d47a1',
      padding: '1.5em',
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Tüm ayarları sıfırla
  resetAllSettings(): void {
    Swal.fire({
      title: 'Ayarları Sıfırla',
      text: 'Tüm ayarlarınız varsayılan değerlere döndürülecek. Bu işlem geri alınamaz.',
      icon: 'warning',
      iconHtml: '⚠️',
      background: '#fff3e0',
      color: '#e65100',
      padding: '1.5em',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sıfırla',
      cancelButtonText: 'İptal',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.userSettings = {
          firstName: 'Kullanıcı',
          lastName: 'Adı',
          email: 'kullanici@example.com',
          emailNotifications: false,
          dailyReminders: false,
          theme: 'light',
          language: 'tr'
        };

        this.initProfileForm();
        this.initSettingsForm();

        Swal.fire({
          icon: 'success',
          iconHtml: '🔄',
          title: 'Sıfırlandı!',
          text: 'Tüm ayarlar varsayılan değerlere döndürüldü.',
          background: '#e8f5e9',
          color: '#1b5e20',
          padding: '1.5em',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
} 