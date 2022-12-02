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
    let result: any = localStorage.getItem('usuarioLogueado');
    let usuarioLogueado = JSON.parse(result);
    if(usuarioLogueado.nombre == 'Administrador' || usuarioLogueado.nombre == 'administrador'){
      this.admin = true;
      this.displayedColumns.push('accion')
    }
  }
  crearAlumno(){
    this.router.navigate(['/crearAlumno']);
  }

  ngOnDestroy(): void {
    if(this.subscripcion1) return this.subscripcion1.unsubscribe();
  }







}
