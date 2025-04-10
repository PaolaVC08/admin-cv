import { Component } from '@angular/core';
import { EducationService} from '../services/education-service/education.service';
import { Education } from '../models/education/education.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-admin-education',
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.css'
})
export class AdminEducationComponent {
  itemCount: number =0;
  btnTxt: string = "Agregar";
  education: Education[] = [];
  selectedId?: string = '';
  myEducation: Education = new Education();
  errorMessage: string = '';

  constructor(public educationService: EducationService)
        {
                console.log(this.educationService);
                this.educationService.getEducation().snapshotChanges().pipe(
                  map(changes =>
                     changes.map(c =>
                        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
                     )
                )
              ).subscribe(data => {
               this.education = data;
               console.log(this.education);
              });
        }

	  isValid(): boolean {
    const { name, school, startDate, endDate } = this.myEducation;
    return !!(name?.trim() && school?.trim() && startDate?.trim() && endDate?.trim());
  }

agregarEducation() {

if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }


  if (this.selectedId) {
    if (confirm('Are you sure you want to update this education?')) {
    this.educationService.updateEducation(this.selectedId, this.myEducation).then(() => {
      console.log('Updated education successfully!');
      this.resetForm();
    });
    }
  } else {
    this.educationService.createEducation(this.myEducation).then(() => {
      console.log('Created new education successfully!');
      this.resetForm();
    });
  }
}

  deleteEducation(id? :string){
    if (confirm('Are you sure you want to delete this education?')) {
    this.educationService.deleteEducation(id).then(()=>{
      console.log('Delete item successfully!');
    });
    	console.log(id);
  }}

  updateEducation(id?: string) {
  const eduToEdit = this.education.find(e => e.id === id);
  if (eduToEdit) {
    this.myEducation = { ...eduToEdit };
    this.selectedId = id;
    this.btnTxt = "Save";
  }
}
resetForm() {
  this.myEducation = new Education();
  this.selectedId = '';
  this.btnTxt = "Agregar";
  this.errorMessage = ''; //reset el mensaje 
}

}
