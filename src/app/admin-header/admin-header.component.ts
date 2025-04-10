import { Component } from '@angular/core';
import { HeaderService } from '../services/header-service/header.service';
import { Header } from '../models/header/header.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  header: Header[] = [];
  myHeader: Header = new Header();
  selectedId?: string = '';
  canAddHeader: boolean = true;
  errorMessage: string = '';

  constructor(public headerService: HeaderService) {
    this.headerService.getHeader().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.header = data;
      this.canAddHeader = this.header.length === 0;
    });
  }

  isValid(): boolean {
    const { name, goalLife, photoURL, email, phoneNumber, location, socialNetwork } = this.myHeader;
    return !!(name?.trim() && goalLife?.trim() && photoURL?.trim() && email?.trim() && phoneNumber?.trim() && location?.trim() && socialNetwork?.trim());
  }

  agregarHeader() {

if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }
this.errorMessage = ''; 
	if (confirm('Are you sure you want to update this header?')) {
    if (this.selectedId) {
      this.headerService.updateHeader(this.selectedId, this.myHeader).then(() => {
        console.log('Header updated successfully!');
        this.resetForm();
      });
    }
    } else {
      this.headerService.createHeader(this.myHeader).then(() => {
        console.log('Created new header successfully!');
        this.resetForm();
      });
    }
  }

  deleteHeader(id?: string) {
    if (confirm('Are you sure you want to delete this header?')) {
	  this.headerService.deleteHeader(id).then(() => {
      console.log('Deleted header successfully!');
    });
  }}

  updateHeader(id?: string) {
    const headerToEdit = this.header.find(h => h.id === id);
    if (headerToEdit) {
      this.myHeader = { ...headerToEdit };
      this.selectedId = id;
      this.btnTxt = "Save";
      this.errorMessage = ''; //reset el mensaje
    }
  }

  resetForm() {
    this.myHeader = new Header();
    this.selectedId = '';
    this.btnTxt = "Agregar";
  }
}

