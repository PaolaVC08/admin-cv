import { Component } from '@angular/core';
import { LanguagesService} from '../services/languages-service/languages.service';
import { Languages } from '../models/languages/languages.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-languages',
  templateUrl: './admin-languages.component.html',
  styleUrl: './admin-languages.component.css'
})
export class AdminLanguagesComponent {
  itemCount: number =0;
  selectedId?: string = '';
  btnTxt: string ="Add";
  languages: Languages[] =[];
  myLanguage: Languages = new Languages();
  errorMessage: string = '';

  constructor(public languagesService: LanguagesService)
  {
  	console.log(this.languagesService);
		this.languagesService.getLanguages().snapshotChanges().pipe(
		  map(changes =>
		     changes.map(c =>
		        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
		     )
		)
	      ).subscribe(data => {
	       this.languages = data;
	       console.log(this.languages);
	      });
        }
  isValid(): boolean {
    return this.myLanguage.language !== undefined && this.myLanguage.language.trim().length > 0;
  }
  agregarLanguage() {
    if (!this.isValid()) {
      this.errorMessage = 'Please fill out all fields.';
      return;
    }

    this.errorMessage = '';
//modificar 
    if (this.selectedId) {
      if (confirm('Are you sure you want to update this language?')) {
        this.languagesService.updateLanguage(this.selectedId, this.myLanguage).then(() => {
          console.log('Updated language successfully!');
          this.resetForm();
        });
      }
  } else {
    //agregar
    this.languagesService.createLanguage(this.myLanguage).then(() => {
      console.log('Created new language successfully!');
      this.resetForm();
    });
  }
}


  deleteLanguage(id? :string){
   if (confirm('Are you sure you want to delete this language?')) {
    this.languagesService.deleteLanguage(id).then(()=> {
      console.log('delete item successfully!');
    });
      console.log(id);
   }
  }
  updateLanguage(id?: string) {
  const languageToEdit = this.languages.find(lang => lang.id === id);
  if (languageToEdit) {
    this.myLanguage = { ...languageToEdit }; // clona los datos
    this.selectedId = id;
    this.btnTxt = "Save";
  }
}

resetForm() {
  this.myLanguage = new Languages();
  this.selectedId = '';
  this.btnTxt = "Add";
  this.errorMessage = ''; //reset el mensaje 
}


}
