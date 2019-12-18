import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-modal-recap',
  templateUrl: './modal-recap.component.html',
  styleUrls: ['./modal-recap.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ModalRecapComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
ngOnInit(): void {
}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
