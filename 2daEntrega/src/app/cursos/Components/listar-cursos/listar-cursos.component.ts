import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Curso } from 'src/app/models/models';
import { CursosService } from '../../Services/cursos.service';
import { EliminarCursoComponent } from '../eliminar-curso/eliminar-curso.component';

@Component({
  selector: 'app-listar-cursos',
  templateUrl: './listar-cursos.component.html',
  styleUrls: ['./listar-cursos.component.css']
})
export class ListarCursosComponent implements OnInit {

  public admin: boolean = false;
  public cursos: Curso[];
  constructor(
    private router: Router,
    private cursosService: CursosService,
    public dialog: MatDialog,
  ) {
    this.cursos =  [];
  }

  ngOnInit(): void {
    this.usrLogueado();
    this.traerCursos();
  }

  usrLogueado(){
    let user: any, result: any = localStorage.getItem('usuarioLogueado');
    user = JSON.parse(result);
    console.log(user)
    if(user.nombre == 'Administrador' || user.nombre == 'administrador'){
      this.admin = true;
    }
  }

  traerCursos() {
    this.cursosService.getCursos().subscribe(
      res => {
        console.log(res)
        this.cursos = res.cursos;
      }
    )
  }

  cursoPerfil(curso: Curso){
    console.log(curso);
    this.router.navigate(['/cursos/cursoPerfil/', curso._id])
  }

  editarCurso(curso: Curso){
    console.log(curso);
    let Curso: any = JSON.stringify(curso);
    localStorage.setItem('editarCurso', Curso)
    this.router.navigate(['/editarCurso', curso._id])
  }

  eliminarCurso(curso: Curso){
    console.log(curso)
    this.cursosService.eliminarCurso(curso._id).subscribe(
      res => {
        console.log(res)
        this.traerCursos();
      }
    )
  }


}
