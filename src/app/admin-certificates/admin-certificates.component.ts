import { Component } from '@angular/core';
import { CertificatesService } from '../services/certificates-service/certificates.service';
import { Certificates }from '../models/certificates/certificates.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-certificates',
  templateUrl: './admin-certificates.component.html',
  styleUrl: './admin-certificates.component.css'
})
export class AdminCertificatesComponent {
   itemCount: number = 0;
   selectedId?: string = '';
   btnTxt: string = "Agregar";
   certificates: Certificates[] = [];
   myCertificates: Certificates = new Certificates();
   errorMessage: string ='';
    constructor(public certificatesService: CertificatesService)
    {
        console.log(this.certificatesService);
        this.certificatesService.getCertificates().snapshotChanges().pipe(
          map(changes =>
            changes.map( c =>
             ({ id: c.payload.doc.id, ...c.payload.doc.data() })
            )
          )
        ).subscribe(data => {
          this.certificates = data;
          console.log(this.certificates);
        });
    }
	
	isValid(): boolean {
  const { title, year, description } = this.myCertificates;
  return !!(title?.trim() && year?.trim() && description?.trim());
}


    AgregarCertificates() {
	    if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

  if (this.selectedId) {
    // Modo actualizar
if (confirm('Are you sure you want to update this certificate?')) {
    this.certificatesService.updateCertificates(this.selectedId, this.myCertificates).then(() => {
      console.log('Updated certificate successfully!');
      this.resetForm();
    });
}
  } else {
    // Modo agregar
    this.certificatesService.createCertificates(this.myCertificates).then(() => {
      console.log('Created new certificate successfully!');
      this.resetForm();
    });
  }
}


  deleteCertificates(id? :string){
	  if (confirm('Are you sure you want to delete this certificate?')) {

    this.certificatesService.deleteCertificates(id).then(() => {
       console.log('Delete item successfully!');
    });
    console.log(id);
  }}

  updateCertificates(id?: string) {
  const certToEdit = this.certificates.find(c => c.id === id);
  if (certToEdit) {
    this.myCertificates = { ...certToEdit };
    this.selectedId = id;
    this.btnTxt = "Save";
  }
}
resetForm() {
  this.myCertificates = new Certificates();
  this.selectedId = '';
  this.btnTxt = "Agregar";
  this.errorMessage = '';
}

}
