import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';




@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],  
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  currentUserId: number | null = null;
  email: string = ''; 

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router ,
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserDetail()?.id || null;
    this.loadUsers(); 
  }

 
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        
        this.users = data.filter(user => user.id !== this.currentUserId); 
      },
      error: (err) => {
        this.toastr.error('Erro ao carregar lista de usuários');
      }
    });
  }

 
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastr.success('Usuário deletado com sucesso');
        this.loadUsers(); 
      },
      error: (err) => {
        this.toastr.error('Erro ao deletar usuário');
      }
    });
  }


  goToHome(): void {
    this.router.navigate(['home']);
  }

  seachUserByEmail(email: string): void {
    if(email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (data) => {
          console.log(data);
          this.users = [data];
        },
        error: (err) => {
          this.toastr.error('Usuário não encontrado');
       }
      
      });
    } else {
    this.toastr.warning('Digite um email para pesquisar');
    this.loadUsers();
  }
}
}
