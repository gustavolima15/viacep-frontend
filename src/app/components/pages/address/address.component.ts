import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { AddressResponse } from '../../../types/address.response.type';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AddressService, StateResponse } from '../../../services/address/address.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ViaCepService } from '../../../services/address/via-cep.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { LoadingComponent } from '../../loading/loading.component';
import { OnlyNumbersDirective } from '../../../directives/only-numbers/only-numbers.directive';
import { AddressDetailsComponent } from '../../dialog/address-details/address-details.component';
import { ConfirmDeleteComponent } from '../../dialog/confirm-delete/confirm-delete.component'; // Importando o componente de confirmação

@Component({
  selector: 'app-endereco',
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    DialogComponent,
    LoadingComponent,
  ],
  providers: [OnlyNumbersDirective],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  currentPage = 1;
  collectionSize = 1;
  pageSize = 5;
  addresses$ = new Observable<AddressResponse[]>();
  type = 'create';

  dataStates$ = new Observable<StateResponse[]>();
  dataCities$ = new Observable<StateResponse[]>();
  addressIdDelete: string = '';
  isDisabledCities: boolean = true;
  isLoading: boolean = true;
  isCityLoading = false;
  isSubmit = false;

  constructor(
    private addressServe: AddressService,
    private toastr: ToastrService,
    private formBuilderService: NonNullableFormBuilder,
    private viaCepService: ViaCepService,
    public dialog: MatDialog,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listAllAddressByUser();
  }

  listAllAddressByUser() {
    this.isLoading = true;
    this.addresses$ = this.addressServe
      .getAllAddressByUser(this.currentPage - 1, this.pageSize)
      .pipe(
        map((pagination) => {
          this.collectionSize = pagination.totalElements;
          return pagination.content;
        })
      );
    this.addresses$.subscribe(() => (this.isLoading = false));
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.listAllAddressByUser();
  }

  protected form = this.formBuilderService.group({
    id: [''],
    postalCode: [
      '',
      [Validators.required, Validators.maxLength(8), Validators.minLength(8)],
    ],
    street: ['', Validators.required],
    location: ['', Validators.required],
    locationType: ['', Validators.required],
    neighborhood: ['', Validators.required],
    number: ['', Validators.required],
    block: [''],
    lot: [''],
    complement: [''],
    cityId: [''],
    stateId: ['', Validators.required],
    isMainAddress: [false, Validators.required],
  });

  onSubmit(modalRef: any) {
    const isFormValid = this.form.valid;
    this.isSubmit = true;
    if (isFormValid) {
      const requestData = this.form.value;
      if (this.form.value.id) {
        this.addressServe.putAddressByUser(requestData).subscribe({
          next: (value) => {
            this.toastr.success('Endereço editado com sucesso');
            this.listAllAddressByUser();
          },
          error: (value) => {
            this.toastr.error('Erro ao editar o endereço');
          },
        });
      } else {
        this.addressServe.createAddressByUser(requestData).subscribe({
          next: (value) => {
            this.toastr.success('Endereço salvo com sucesso');
            this.listAllAddressByUser();
          },
          error: (value) => {
            this.toastr.error('Erro ao salvar o endereço');
          },
        });
      }
      this.form.reset();
      modalRef.dismiss();
    } else {
      this.toastr.error('Preencha todos os campos');
    }
  }

  open(content: TemplateRef<any>) {
    this.dataStates$ = this.addressServe.getAllState();
    this.isDisabledCities = true;
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-title',
        scrollable: true,
        size: 'lg',
      })
      .result.then(
        (result) => {
          this.form.reset();
        },
        (reason) => {
          this.form.reset();
        }
      )
      .catch((error) => {
        this.form.reset();
      });
  }

  handleChangeState(event: Event) {
    const inputElement = event.target as HTMLSelectElement;
    const stateId = parseInt(inputElement.value);

    if (stateId) {
      this.isCityLoading = true;
      this.dataCities$ = this.addressServe.getAllCitieyByState(stateId);
    }
  }

  onEdit(content: TemplateRef<any>, address: AddressResponse) {
    this.type = 'edit';
    this.addressServe.getAddressById(address.id).subscribe({
      next: (value) => {
        this.dataCities$ = this.addressServe.getAllCitieyByState(
          value.state.id
        );
        this.form.patchValue({
          ...value,
          cityId: value.city.id.toString(),
          stateId: value.state.id.toString(),
          id: value.id.toString(),
        });
      },
    });
    this.open(content);
  }

  onDelete(address: AddressResponse) {
    this.addressIdDelete = address.id.toString();
    this.addressServe.deleteAddressByUser(address.id).subscribe({
      next: (value) => {
        this.toastr.success('Endereço deletado com sucesso');
        this.listAllAddressByUser();
      },
      error: (value) => {
        this.toastr.error('Erro ao deletar o endereço');
      },
    });
  }

  getCep(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;

    this.viaCepService
      .getCep(inputValue)
      .pipe(
        switchMap((valueCep) => {
          return this.dataStates$.pipe(
            switchMap((states) => {
              this.form.patchValue({
                street: valueCep.logradouro,
                location: valueCep.localidade,
                neighborhood: valueCep.bairro,
              });
              const matchingState = states.find(
                (state) =>
                  state.abbreviation.toLowerCase() === valueCep.uf.toLowerCase()
              );

              if (matchingState) {
                this.form.patchValue({
                  stateId: matchingState.id.toString(),
                });
                this.dataCities$ = this.addressServe.getAllCitieyByState(
                  matchingState.id
                );
              }

              return this.dataCities$;
            })
          );
        })
      )
      .subscribe({
        next: (valueCep) => {
          console.log(valueCep);
          this.dataCities$.subscribe((cities) => {
          });
        },
        error: (err) => {
          console.error('Erro ao processar CEP:', err);
        },
      });
  }

  openAddressDetails(address: AddressResponse) {
    const dialogRef = this.dialog.open(AddressDetailsComponent, {
      data: { address: address },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialog(address: AddressResponse) {
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: {
        title: 'Confirmar Exclusão',
        content: 'Tem certeza que deseja deletar este endereço?',
      },
    });

    dialogRef.afterClosed().subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.onDelete(address);
      }
    });
  }
}
