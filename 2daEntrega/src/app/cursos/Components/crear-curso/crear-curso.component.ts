import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/models';
import { CursosService } from '../../Services/cursos.service';

@Component({
  selector: 'app-crear-curso',
  templateUrl: './crear-curso.component.html',
  styleUrls: ['./crear-curso.component.css']
})
export class CrearCursoComponent implements OnInit {

  public curso!: Curso;
  public formCurso: FormGroup
  public uploadFile: File[];
  constructor(
    private formBuilder: FormBuilder,
    private cursoServices: CursosService,
    private router: Router
  ) {
    this.uploadFile = [];
    this.formCurso = this.formBuilder.group({
      profesor: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      inicia: ['', [Validators.required]],
      finaliza: ['', [Validators.required]],
      inscripcion: ['', [Validators.required]],
    });
  }



  ngOnInit(): void {
  }

  crearCurso() {
    console.log(this.formCurso.value)
    console.log(this.formCurso)
    if(this.uploadFile){
      this.cursoServices.crearCurso(this.formCurso.value, this.uploadFile).subscribe(
        res => {
          console.log(res);
          this.router.navigate(['/cursos'])
        }
      )
    }
  }

  subirImg(event: any) { 
    console.log(event)
     this.uploadFile = <Array<File>>event.target.files[0];
    //this.uploadFile = event.target.files[0];
    console.log(this.uploadFile);
  }

}
