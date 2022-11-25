import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { alumno } from 'src/app/models/models';
import { AlumnosService } from '../../Services/alumnos.service';
interface genero {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-cear-alumno',
  templateUrl: './cear-alumno.component.html',
  styleUrls: ['./cear-alumno.component.css']
})
export class CearAlumnoComponent implements OnInit {

  public formAlumno: FormGroup;
  public alumno: alumno;
  public id: any;
  public Generos: genero[];
  public form: any;
  constructor(
    private alumnosSrrvices: AlumnosService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.Generos = [
      {value: 'genero-0', viewValue: 'Masculino'},
      {value: 'genero-1', viewValue: 'Femenino'},
    ];

    this.formAlumno = this.formBuilder.group({
      email: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      edad: ['', [Validators.required, Validators.min(15), this.ValidateAge()]],
      pais: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      clave: ['', [Validators.required]]
      //skills: new FormArray([new FormControl])

    });

    this.alumno = {_id: '', email: '', nombre: '', apellido: '', edad:0, pais:'', sexo:'', clave:''}

  }
  ngOnInit(): void {
    
  }

  crearAlumno(){
    console.log(this.formAlumno.value);
    this.alumnosSrrvices.crearAlumno(this.formAlumno.value).subscribe(
      res => {
        console.log(res);
        this.router.navigate(['/alumnos'])
      }
    )
  }

  Registrar(form: FormGroup): void {
    console.log(this.form.value);
    //this.addAthlete.emit(this.form.value);
    form.reset();
  }

  get skils(): FormArray {
    return this.formAlumno.get('skills') as FormArray;
  }

  addHability(): void {
    this.skils.push(new FormControl())
  }

  ValidateAge(): ValidatorFn {
    return (control: AbstractControl): { [key: string ]: any} | null => {
      return (!Number.isInteger(parseInt(control.value))) ? { failAge: true } : null;
    }
  }

  noCrear(){
    return;
  }

}