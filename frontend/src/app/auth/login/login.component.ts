import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;
  
  constructor(
    private fb:FormBuilder,
    private router:Router

  ){}

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      email:[ '',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })
  }
    
  onSubmit():void{
    if(this.loginForm.invalid){
      console.log('Form geçersiz!');
      return;
    }
    console.log('Form Değerleri:' , this.loginForm.value);
    // Kullanıcıyı localStorage'a kaydet
    localStorage.setItem('user', JSON.stringify(this.loginForm.value));
    this.router.navigate(['/dashboard']);
  }

     
}
