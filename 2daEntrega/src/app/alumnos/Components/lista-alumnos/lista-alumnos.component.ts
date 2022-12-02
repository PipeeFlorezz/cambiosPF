import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlumnosService } from '../../Services/alumnos.service';
import { EliminarAlumnoComponent } from '../eliminar-alumno/eliminar-alumno.component';
import { Admin, alumno } from '../../../models/models';
import {  Subscription } from 'rxjs';
import { EditarAlumnoComponent } from '../editar-alumno/editar-alumno.component';
import { selectAlumnosCargados } from '../../state/alumnos.selectors';
import { Store } from '@ngrx/store';
import { deleteAlumno, loadAlumnos, updateAlumno } from '../../state/alumnos.actions';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css']
})
export class ListaAlumnosComponent implements OnInit, OnDestroy {
  public sppiner: boolean = true;
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
    private alumnosServicios: AlumnosService,
    private store: Store
  ) { 
    this.store.dispatch(loadAlumnos())
    this.alumnos = [];
    this.admin = false;
    this.alumno = false;
    this.displayedColumns  = ['email', 'nombre', 'apellido', 'edad', 'pais', 'sexo'];
  }

  ngOnInit(): void {
    this.usuarioLogueado();
    this.traerAlumnos();

  }

  ngOnDestroy(): void {
    if(this.subscripcion1) return this.subscripcion1.unsubscribe();
  }

  traerAlumnos(){
    setTimeout(() => {
      this.subscripcion1 = this.store.select(selectAlumnosCargados).subscribe((alumnos: alumno[]) => {

        if(alumnos && alumnos.length >= 1){
          setTimeout(() => {
            this.alumnos = alumnos;
            this.sppiner = false;
          }, 1500);
        }
      });
    }, 1200);
  }

  eliminarAlumno(Alumno: alumno){
    let dialog = this.Dialog.open(EliminarAlumnoComponent, {
      width: '46%',
      height: '25%'
    })

    dialog.beforeClosed().subscribe(res => {
      if(res === undefined || res.length === 0 || res == '') return;
      if(res == 'Eliminar'){
        this.store.dispatch(deleteAlumno({alumno: Alumno}))
      }
    })
  }

  editarAlumno(Alumno: alumno){
    let alumno: any = JSON.stringify(Alumno);
    localStorage.setItem('editarAlumno', alumno)
    let dialog = this.Dialog.open(EditarAlumnoComponent, {
      width: '75%',
      height: '65%'
    })

    dialog.beforeClosed().subscribe(alumno => {
      localStorage.removeItem('editarAlumno')
      if(alumno === undefined || alumno.length === 0 || alumno == '') return
      alumno._id = Alumno._id;
       this.store.dispatch(updateAlumno({alumno: alumno}))
    })
  }

  usuarioLogueado(){
    let result: any = localStorage.getItem('usuarioLogueado');
    let usuarioLogueado = JSON.parse(result);
    if(usuarioLogueado.nombre == 'Administrador' || usuarioLogueado.nombre == 'administrador'){
      this.admin = true;
      this.displayedColumns.push('accion')
    }
  }

}
