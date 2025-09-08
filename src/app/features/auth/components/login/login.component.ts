import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

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
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        // Successful login - redirect to home
        this.router.navigate(['/home']);
        
      } catch (error: any) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    }
  }
}


