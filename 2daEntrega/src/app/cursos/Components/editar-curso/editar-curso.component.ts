import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Curso, alumno } from '../../../models/models'
import { CursosService } from 'src/app/cursos/Services/cursos.service';

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar-curso.component.html',
  styleUrls: ['./editar-curso.component.css']
})
export class EditarCursoComponent implements OnInit {


  public subscripcion!: Subscription
  public curso: any;
  public id: any;
  public formCurso: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private cursosService: CursosService,
    private router: Router
  ) { 

    this.formCurso = this.formBuilder.group({
      profesor: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      inicia: ['', [Validators.required]],
      finaliza: ['', [Validators.required]],
      inscripcion: ['', [Validators.required]],
    });

    let result: any = localStorage.getItem('editarCurso');
    let resultf = JSON.parse(result);
    console.log(resultf);
    this.curso = resultf;

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.id = params['id'];

    })
  }

  editarCurso() {
    console.log(this.formCurso.value)
    this.cursosService.editarCurso(this.formCurso.value, this.id).subscribe(
      res => {
        console.log(res);
        localStorage.removeItem('editarCurso')
        this.router.navigate(['/cursos']);
      }
    )
  }
}
