import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,   // Certifique-se de importar MatDialogModule
    MatButtonModule    // Importando MatButtonModule para os botões
  ],
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);  // Confirmar a exclusão
  }

  onCancel(): void {
    this.dialogRef.close(false);  // Cancelar a exclusão
  }
}
