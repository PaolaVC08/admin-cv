import { Component } from '@angular/core';
import { WorkExperienceService } from '../services/work-experience-service/work-experience.service';
import { WorkExperience } from '../models/work-experience/work-experience.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-workexperience',
  templateUrl: './admin-workexperience.component.html',
  styleUrl: './admin-workexperience.component.css'
})
export class AdminWorkexperienceComponent {
  itemCount: number = 0;
  btnTxt: string = "Agregar";
  goalText: string = "";
  workExperience: WorkExperience[] = [];
  myWorkExperience: WorkExperience = new WorkExperience();
  selectedId?: string = '';
  errorMessage: string = '';


  constructor(public workExperienceService: WorkExperienceService) {
    console.log(this.workExperienceService);
    this.workExperienceService.getWorkExperience().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.workExperience = data;
      console.log(this.workExperience);
    });
  }

  isValid(): boolean {
    const { company, position, startDate, endDate, location, accomplishment } = this.myWorkExperience;
    return !!(company?.trim() && position?.trim() && startDate?.trim() && endDate?.trim() && location?.trim() && accomplishment?.trim());
  }

  AgregarJob() {
   if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.errorMessage = '';
if (confirm('Are you sure you want to update this job?')) {
    if (this.selectedId) {
      this.workExperienceService.updateWorkExperience(this.selectedId, this.myWorkExperience).then(() => {
        console.log('Updated work experience successfully!');
        this.resetForm();
      });
    }
    } else {
      this.workExperienceService.createWorkExperience(this.myWorkExperience).then(() => {
        console.log('Created new work experience successfully!');
        this.resetForm();
      });
    }
  }

  deleteJob(id?: string) {
   if (confirm('Are you sure you want to delete this job?')) {
    this.workExperienceService.deleteWorkExperience(id).then(() => {
      console.log('Deleted work experience successfully!');
    });
    console.log(id);
  }
  }

  updateJob(id?: string) {
    const jobToEdit = this.workExperience.find(j => j.id === id);
    if (jobToEdit) {
      this.myWorkExperience = { ...jobToEdit };
      this.selectedId = id;
      this.btnTxt = "Save";
    }
  }

  resetForm() {
    this.myWorkExperience = new WorkExperience();
    this.selectedId = '';
    this.btnTxt = "Agregar";
    this.errorMessage = ''; //reset el mensaje
  }
}

