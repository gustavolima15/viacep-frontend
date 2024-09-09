import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Torna o AuthService público para que possa ser acessado no template HTML
  constructor(public authService: AuthService) { }

  signOut() {
    this.authService.signOut();
  }
}

