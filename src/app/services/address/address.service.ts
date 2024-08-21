import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { AddressResponse } from '../../types/address.response.type';
import { Pagination } from '../../types/pagination.type';
import { AddressRequest } from '../../types/address.request.type';
import { Observable } from 'rxjs';

export interface StateResponse {
  id: number;
  name: string;
  abbreviation: string;
}
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  apiUrl: string = environment.apiUrl;
  userId: number | null;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    this.userId = authService.getUserDetail()?.id || null;
  }

  getAllAddressByUser(page: number = 0, size: number = 5) {
    return this.httpClient.get<Pagination<AddressResponse>>(
      `${this.apiUrl}/user/${this.userId}/address?&page=${page}&size=${size}`
    );
  }

  getAddressById(id: number ) {
    return this.httpClient.get<AddressResponse>(

      `${this.apiUrl}/user/${this.userId}/address/${id}`
    );
  }

  deleteAddressByUser(addressId: number) {
    return this.httpClient.delete(
      `${this.apiUrl}/user/${this.userId}/address/${addressId}`
    );
  }

  getAllState(): Observable<StateResponse[]>{
    return this.httpClient.get<StateResponse[]>(`${this.apiUrl}/address/state`);
  }
  getAllCitieyByState(stateId: number):Observable<StateResponse[]> {
    return this.httpClient.get<StateResponse[]>(`${this.apiUrl}/address/citiesByState/`+stateId);
  }
  createAddressByUser(address: any) {
    return this.httpClient.post(
      `${this.apiUrl}/user/${this.userId}/address`,address
    );
  }
  putAddressByUser(address: any) {
    return this.httpClient.put(
      `${this.apiUrl}/user/${this.userId}/address`,address
    );
  }
}
