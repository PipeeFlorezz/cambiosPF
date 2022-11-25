import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CursosService } from '../../Services/cursos.service';
import { Admin, alumno, Curso } from '../../../models/models'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InscribirEstudianteComponent } from '../inscribir-estudiante/inscribir-estudiante.component'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-curso-profile',
  templateUrl: './curso-profile.component.html',
  styleUrls: ['./curso-profile.component.css']
})
export class CursoProfileComponent implements OnInit, OnDestroy {

  public curso: Curso;
  public estudiantes!: alumno[];
  public displayedColumns: string[];
  public subscripcion!: Subscription
  public token: any;
  public admin: boolean = false;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cursosService: CursosService
  ) {
    this.displayedColumns = ['email', 'nombre', 'apellido', 'edad', 'pais', 'sexo'];
    //this.cursos = this.cursosService.llamarCursos();
    this.curso = {
      _id: '',
      profesor: '', nombre: '',
      inicia: new Date(),
      finaliza: new Date(),
      estudiantes: [{_id: '', email: '', nombre: '', apellido: '', edad: 0, pais: '', sexo: '', clave: ''}],
      imagen: '',
      inscripcion: true
    }
  }

  ngOnInit(): void {
    this.usrLogueado();
    this.route.params.subscribe((params: any) => {
      console.log(params['id']);
      let id: any = params['id'];
      this.llamarCurso(id);
    });
  }

  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
  }

  usrLogueado(){
    let user: any, result: any = localStorage.getItem('usuarioLogueado');
    user = JSON.parse(result);
    console.log(user)
    if(user.nombre == 'Administrador' || user.nombre == 'administrador'){
      this.admin = true;
    }
  }

  inscribirme(curso: Curso): void {
    let dialog = this.dialog.open(InscribirEstudianteComponent, {
      width: '50%',
      height: '68%'
    });

    dialog.beforeClosed().subscribe(res => {
      console.log(res);
      console.log(typeof res)
      if(res === undefined) return;
      if(res.length == 0) return;
      if(res.nombre.length == 0) return;
      this.cursosService.inscribirEstudiante(res, curso._id).subscribe(
        res => {
          console.log(res)
          this.estudiantes = res.cursoActualizado.estudiantes;
          this.curso.estudiantes = this.estudiantes;
        }
      )
    })
  }

  llamarCurso(id: any){
    this.subscripcion = this.cursosService.getCurso(id).subscribe(
      res => {
        console.log(res)
        this.curso = res.curso;
        this.estudiantes = this.curso.estudiantes
        console.log(this.curso);
      }
    )
  }
  
}
