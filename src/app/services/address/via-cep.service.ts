import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

interface CepResponse {
  bairro: string;
  cep: number;
  complemento: string;
  ddd: number;
  gia: string;
  ibge: number;
  localidade: string;
  logradouro: string;
  siafi: number;
  uf: string;
}
@Injectable({
  providedIn: 'root',
})
export class ViaCepService {
  baseUrl = 'https://viacep.com.br/ws/';
  constructor(private httpClient: HttpClient) {}
  getCep(cep: string) {
    return this.httpClient.get<CepResponse>(`${this.baseUrl}${cep}/json/`);
  }
}
