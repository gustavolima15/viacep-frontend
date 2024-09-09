import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card'; // Adicionar essa linha
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, // Certifique-se de que isso está incluído
    MatCardModule, // Adicionar o MatCardModule aqui
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
