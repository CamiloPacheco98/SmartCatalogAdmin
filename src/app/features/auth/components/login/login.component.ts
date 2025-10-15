import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../../../core/services/auth.service";
import { FirestoreService } from "../../../../core/services/firestore.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = "";

      try {
        const { email, password } = this.loginForm.value;
        const userAuth = await this.authService.login(email, password);
        const userInfo = await this.firestoreService.getUserInfo(userAuth.uid);
        if (userInfo.isAdmin()) {
          this.router.navigate(["/home"]);
        } else {
          this.errorMessage = "No tienes permisos para acceder a esta aplicación";
        }
      } catch (error) {
        this.errorMessage =
          error instanceof Error ? error.message : "Ocurrió un error desconocido";
      } finally {
        this.loading = false;
      }
    }
  }
}
