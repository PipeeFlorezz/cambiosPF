import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormArray, FormControl, Validators, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms'
import { CursosService } from 'src/app/cursos/Services/cursos.service';
import { Subscription } from 'rxjs';
import { Admin, alumno, Curso } from '../../../models/models';
interface genero {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-inscribir-estudiante',
  templateUrl: './inscribir-estudiante.component.html',
  styleUrls: ['./inscribir-estudiante.component.css']
})
export class InscribirEstudianteComponent implements OnInit {

  public formAlumno: FormGroup;
  public Generos: genero[];
  public admin: boolean ;
  public usuario: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<InscribirEstudianteComponent>

  ) { 

      this.admin = false;
      this.usuario = true;
      this.Generos = [
      {value: 'genero-0', viewValue: 'Masculino'},
      {value: 'genero-1', viewValue: 'Femenino'},
    ];

    this.formAlumno = this.formBuilder.group({
      email: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      clave: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    let result: any = localStorage.getItem('usuarioLogueado');
    let usuario = JSON.parse(result);
    if(usuario.nombre == 'Administrador' || usuario.nombre == 'Administrador'){
      this.admin = true;
      this.usuario = false;
    }else {
      this.usuario = true;
      this.admin = false;
    }
  }

  inscribirAlumno(){
    console.log(this.formAlumno.value);
    let data: any = this.formAlumno.value
    this.matDialogRef.close(data);
  }

}
