import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import Validation from '../../../utils/validation';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { SignUpForm } from '../../../types/signup.request.type';
import { InputBoxComponent } from '../../input-box/input-box.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLinkActive,
    InputBoxComponent,
  ],
  providers: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  submitted: boolean = false;
  hidePassword: boolean = true;
  protected isLoading = false;
  constructor(
    private formBuilderService: NonNullableFormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  protected signupForm: FormGroup = this.formBuilderService.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: [
      '',
      [Validators.required, Validation.match('password', 'confirmPassword')],
    ],
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.submitted = true;

    if (this.signupForm.invalid) {
      if (this.signupForm.get('email')?.hasError('email')) {
        this.toastr.error('Email inválido');
      }
      if (this.signupForm.get('password')?.hasError('minlength')) {
        this.toastr.error('password deve ter pelo menos 8 caracteres');
      }
      if (this.signupForm.get('confirmPassword')?.hasError('matching')) {
        this.toastr.error('password e confirma password devem ser iguais');
      }
      return;
    }

    this.isLoading = true;
    const dadosSignup :SignUpForm = this.signupForm.value;
    dadosSignup.role = 'USER';
    this.authService.signUp(dadosSignup).subscribe({
      next: (value) => {

        this.toastr.success('Usário criado com sucesso');
        this.signupForm.reset();
      },
      error: (value) => {
        this.isLoading = false;
        if (value.status === 409) {
          this.toastr.error('Email ja existe');
          return;
        } else {
        }
        this.toastr.error(
          'Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.'
        );
      },
    });
  }
}
