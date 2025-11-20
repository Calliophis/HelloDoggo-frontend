import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-delete-dialog',
  imports: [
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './delete-dialog.component.html'
})
export class DeleteDialogComponent {
  ref = inject(DynamicDialogRef);

  cancel() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }
}
