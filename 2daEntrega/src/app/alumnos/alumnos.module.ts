import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnosRoutingModule } from './alumnos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../angularMaterial/material.module';
import { AlumnosComponent } from './Components/alumnos/alumnos.component';
import { EliminarAlumnoComponent } from './Components/eliminar-alumno/eliminar-alumno.component';
import { AlumnosService } from './Services/alumnos.service';
import { AlumnosGeneroDirective } from './Directivas/alumnos-genero.directive';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { EditarAlumnoComponent } from './Components/editar-alumno/editar-alumno.component';
import { CearAlumnoComponent } from './Components/cear-alumno/cear-alumno.component';
import { ListaAlumnosComponent } from './Components/lista-alumnos/lista-alumnos.component';


@NgModule({
  declarations: [
    AlumnosComponent,
    EliminarAlumnoComponent,
    AlumnosGeneroDirective,
    EditarAlumnoComponent,
    CearAlumnoComponent,
    ListaAlumnosComponent 
  ],
  imports: [
    CommonModule,
    AlumnosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    AlumnosService
  ]
})
export class AlumnosModule { }
