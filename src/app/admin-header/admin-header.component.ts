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

  agregarHeader() {
    if (this.selectedId) {
      this.headerService.updateHeader(this.selectedId, this.myHeader).then(() => {
        console.log('Header updated successfully!');
        this.resetForm();
      });
    } else {
      this.headerService.createHeader(this.myHeader).then(() => {
        console.log('Created new header successfully!');
        this.resetForm();
      });
    }
  }

  deleteHeader(id?: string) {
    this.headerService.deleteHeader(id).then(() => {
      console.log('Deleted header successfully!');
    });
  }

  updateHeader(id?: string) {
    const headerToEdit = this.header.find(h => h.id === id);
    if (headerToEdit) {
      this.myHeader = { ...headerToEdit };
      this.selectedId = id;
      this.btnTxt = "Save";
    }
  }

  resetForm() {
    this.myHeader = new Header();
    this.selectedId = '';
    this.btnTxt = "Agregar";
  }
}

