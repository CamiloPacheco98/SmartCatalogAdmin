import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      // Simular login (aquí iría tu lógica real)
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Ejemplo simple de validación
        if (email === 'admin@example.com' && password === '123456') {
          // Login exitoso
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Credenciales inválidas';
        }
        this.loading = false;
      }, 1000);
    }
  }
}


