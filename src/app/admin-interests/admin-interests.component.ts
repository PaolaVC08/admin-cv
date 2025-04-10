import { Component } from '@angular/core';
import { InterestsService } from '../services/interests-service/interests.service';
import { Interests } from '../models/interests/interests.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-interests',
  templateUrl: './admin-interests.component.html',
  styleUrl: './admin-interests.component.css'
})
export class AdminInterestsComponent {
  itemCount: number = 0;
  selectedId?: string = '';
  btnTxt: string = 'Add';
  interests: Interests[] = [];
  myInterests: Interests = new Interests();
  errorMessage: string = '';

  constructor(public interestsService: InterestsService) {
    this.interestsService.getInterests().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.interests = data;
    });
  }
	
	isValid(): boolean {
    return !!this.myInterests.description?.trim();
  }

  agregarInterests() {

if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }


    if (this.selectedId) {
	     if (confirm('Are you sure you want to update this interest?')) {
      this.interestsService.updateInterests(this.selectedId, this.myInterests).then(() => {
        this.resetForm();
      });
	     }
    } else {
      this.interestsService.createInterests(this.myInterests).then(() => {
        this.resetForm();
      });
    }
  }

  deleteInterests(id?: string) {
	  if (confirm('Are you sure you want to delete this interest?')) {
    this.interestsService.deleteInterests(id).then(() => {
      console.log('Interest deleted');
    });
  }}

  updateInterests(id?: string) {
    const interestToEdit = this.interests.find(item => item.id === id);
    if (interestToEdit) {
      this.myInterests = { ...interestToEdit };
      this.selectedId = id;
      this.btnTxt = 'Save';
    }
  }

  resetForm() {
    this.myInterests = new Interests();
    this.selectedId = '';
    this.btnTxt = 'Add';
    this.errorMessage = '';
  }
}
