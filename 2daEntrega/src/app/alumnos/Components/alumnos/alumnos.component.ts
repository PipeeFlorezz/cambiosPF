import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlumnosService } from '../../Services/alumnos.service';
import { EliminarAlumnoComponent } from '../eliminar-alumno/eliminar-alumno.component';
import { Admin, alumno } from '../../../models/models';
import {  Subscription } from 'rxjs';
import { EditarAlumnoComponent } from '../editar-alumno/editar-alumno.component';

@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styleUrls: ['./alumnos.component.css']
})
export class AlumnosComponent implements OnInit, OnDestroy {

  public alumnos: alumno[];
  public displayedColumns: string[];
  public admin: boolean;
  public alumno: boolean;
  public Admin!: Admin;
  public Alumno!: alumno;
  public subscripcion1!: Subscription;

  constructor(
    public Dialog: MatDialog,
    private router: Router,
    private alumnosServicios: AlumnosService
  ) { 
    this.alumnos = [];
    this.admin = false;
    this.alumno = false;
    this.displayedColumns  = ['email', 'nombre', 'apellido', 'edad', 'pais', 'sexo'];
  }

  ngOnInit(): void {
    this.traerAlumnos();
    let result: any = localStorage.getItem('usuarioLogueado');
    let usuarioLogueado = JSON.parse(result);
    if(usuarioLogueado.nombre == 'Administrador' || usuarioLogueado.nombre == 'administrador'){
      this.admin = true;
      this.displayedColumns.push('accion')
    }
  }

  ngOnDestroy(): void {
    if(this.subscripcion1) return this.subscripcion1.unsubscribe();
  }

  traerAlumnos(){
    this.subscripcion1 = this.alumnosServicios.getAlumnos().subscribe(
      res => {
        console.log(res);
        this.alumnos = res.alumnos
      }
    )
  }

  crearAlumno(): void {
    console.log('crear alumno')
    this.router.navigate(['/crearAlumno']);
  }

  eliminarAlumno(Alumno: alumno){
    console.log(Alumno);

    let dialog = this.Dialog.open(EliminarAlumnoComponent, {
      width: '30%',
      height: '30%'
    })

    dialog.beforeClosed().subscribe(res => {
      console.log(res);
      console.log(typeof res);
      if(res === undefined) return;
      if(res.length === 0) return;
      if(res == '') return;
      if(res == 'Eliminar'){
        this.alumnosServicios.eliminarAlumno(Alumno._id).subscribe(
          res => {
            console.log(res);
            this.traerAlumnos();
          }
        )
      }
    })

  }

  editarAlumno(Alumno: alumno){
    console.log(Alumno)
    let alumno: any = JSON.stringify(Alumno);
    localStorage.setItem('editarAlumno', alumno)
    let dialog = this.Dialog.open(EditarAlumnoComponent, {
      width: '57%',
      height: '55%'
    })

    dialog.beforeClosed().subscribe(alumno => {
      console.log(alumno);
      console.log(Alumno)
      localStorage.removeItem('editarAlumno')

      if(alumno === undefined || alumno.length === 0 || alumno == ''){
        return;
      }
      this.alumnosServicios.editarAlumno(alumno, Alumno._id).subscribe(
        res => {
          console.log(res);
          this.traerAlumnos();
        }
      )
    })
  }






}
