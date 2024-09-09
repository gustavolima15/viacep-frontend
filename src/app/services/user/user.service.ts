import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}


  getUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/user`);
  }

  deleteUser(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/admin/delete-user/${userId}`);
  }
}
