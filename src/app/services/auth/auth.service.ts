import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { AuthResponse } from '../../types/auth-response.type';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // Certifique-se de que jwt-decode está instalado
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { SignUpForm } from '../../types/signup.request.type';

interface UserDetails {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) {
    this.autoSignIn();
  }

  signIn(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((value) => {
          localStorage.setItem('auth-token', value.token);
          this.router.navigate(['home']);
        })
      );
  }

  signUp(dados: SignUpForm): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/user/register`, dados);
  }

  autoSignIn() {
    if (typeof localStorage !== 'undefined') {
      const hasToken = localStorage.getItem('auth-token');
      if (hasToken) {
        this.router.navigate(['/home']);
      }
    }
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }


  getUserDetail = (): UserDetails | null => {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken: any = jwtDecode(token);
      console.log("Decoded Token: ", decodedToken);
  
      const userDetail = {
        id: decodedToken.userId,
        name: decodedToken.userName,
        email: decodedToken.sub,
        role: decodedToken.role,
      };
  
      console.log("User Details: ", userDetail);
      return userDetail;
      
    } catch (error) {
      console.error("Erro ao decodificar o token", error);
      return null;
    }
  };

  isAdmin(): boolean {
    const userDetail = this.getUserDetail();
    return userDetail ? userDetail.role == 'ADMIN' : false;  
  }

  private getToken = (): string | null => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('auth-token') || '';
    }
    return null;
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/auth']);
      return false;
    }
    return this.isTokenExpired();
  };

  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= (decoded['exp'] as number) * 1000;
    if (isTokenExpired) {
      this.toastr.clear();
      this.toastr.warning('sessão expirada', 'Error');
      this.signOut();
    }
    return !isTokenExpired;
  }
}
