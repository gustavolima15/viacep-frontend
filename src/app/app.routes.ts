import { Routes } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AuthComponent } from './components/pages/auth/auth.component';
import { LayoutComponent } from './components/template/layout/layout.component';
import { AddressComponent } from './components/pages/address/address.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AdminGuard } from './guards/admin.guard';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    title: 'login',
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'signup',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        title: 'Home',
        component: HomeComponent,
      },
      {
        path: 'endereco',
        title: 'Endereços',
        component: AddressComponent,
      },

    ],
  },
  {
    path: 'admin/users',
    component: UserListComponent,
    canActivate: [AdminGuard],
    title: 'Admin - Usuários',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Página não encontrada',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}