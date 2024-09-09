import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importe o CommonModule
import { UserService } from '../../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule],  // Certifique-se de que CommonModule está aqui
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentUserId: number | null = null;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserDetail()?.id || null;
    this.loadUsers(); // Carregar a lista de usuários quando o componente inicializar
  }

  // Método para carregar os usuários
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        // Verifique os dados retornados da API
        this.users = data.filter(user => user.id !== this.currentUserId); // Armazena a lista de usuários retornada
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar lista de usuários');
      }
    });
  }

  // Método para deletar um usuário
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastr.success('Usuário deletado com sucesso');
        this.loadUsers(); // Recarrega a lista após deletar
      },
      error: (err) => {
        this.toastr.error('Erro ao deletar usuário');
      }
    });
  }

  goToHome(): void {
    this.router.navigate(['home']);
  }
}
