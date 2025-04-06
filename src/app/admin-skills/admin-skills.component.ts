import { Component } from '@angular/core';
import { SkillsService} from '../services/skills-service/skills.service';
import { Skills } from '../models/skills/skills.model';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-admin-skills',
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.css'
})
export class AdminSkillsComponent {
	selectedId?: string = '';
	itemCount: number =0;
	btnTxt: string = "Add";
	goalText: string = "";
	skills: Skills[] =[];
	mySkill: Skills = new Skills();

	constructor(public skillsService: SkillsService)
	{
		console.log(this.skillsService);
		this.skillsService.getSkills().snapshotChanges().pipe(
		  map(changes =>
		     changes.map(c =>
		        ({ id: c.payload.doc.id, ...c.payload.doc.data() })
		     )
		)
	      ).subscribe(data => {
	       this.skills = data;
	       console.log(this.skills);
	      });
	}


	agregarSkill() {
	  if (this.selectedId) {
	    // Modo actualizar
	    this.skillsService.updateSkills(this.selectedId, this.mySkill).then(() => {
	      console.log('Updated skill successfully!');
	      this.resetForm();
	    });
	  } else {
	    // Modo agregar
	    this.skillsService.createSkills(this.mySkill).then(() => {
	      console.log('Created new skill successfully!');
	      this.resetForm();
	    });
	  }
	}

	deleteSkill(id? :string){
	  this.skillsService.deleteSkills(id).then(()=>{
	    console.log('delete item successfully!');
	  });
	   console.log(id);
	}
	
	updateSkill(id?: string) {
	  const skillToEdit = this.skills.find(s => s.id === id);
 	   if (skillToEdit) {
    	     this.mySkill = { ...skillToEdit }; // clona los datos al formulario
    		this.selectedId = id;
    		this.btnTxt = "Save";
 	 }
	}

	resetForm() {
	  this.mySkill = new Skills();
	  this.selectedId = '';
	  this.btnTxt = "Add";
	}

}
