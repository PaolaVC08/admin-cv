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

  AgregarJob() {
    if (this.selectedId) {
      this.workExperienceService.updateWorkExperience(this.selectedId, this.myWorkExperience).then(() => {
        console.log('Updated work experience successfully!');
        this.resetForm();
      });
    } else {
      this.workExperienceService.createWorkExperience(this.myWorkExperience).then(() => {
        console.log('Created new work experience successfully!');
        this.resetForm();
      });
    }
  }

  deleteJob(id?: string) {
    this.workExperienceService.deleteWorkExperience(id).then(() => {
      console.log('Deleted work experience successfully!');
    });
    console.log(id);
  }

  updateJob(id?: string) {
    const jobToEdit = this.workExperience.find(j => j.id === id);
    if (jobToEdit) {
      this.myWorkExperience = { ...jobToEdit };
      this.selectedId = id;
      this.btnTxt = "Confirmar actualización";
    }
  }

  resetForm() {
    this.myWorkExperience = new WorkExperience();
    this.selectedId = '';
    this.btnTxt = "Agregar";
  }
}

