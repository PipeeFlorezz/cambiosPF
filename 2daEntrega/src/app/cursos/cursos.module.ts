import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../angularMaterial/material.module';
import { EditarCursoComponent } from './Components/editar-curso/editar-curso.component';
import { EliminarCursoComponent } from './Components/eliminar-curso/eliminar-curso.component';
import { CursosComponent } from './Components/cursos/cursos.component';
import { CursoProfileComponent } from './Components/curso-profile/curso-profile.component';
import { CursosService } from './Services/cursos.service';
import { InscribirEstudianteComponent } from './Components/inscribir-estudiante/inscribir-estudiante.component';
import { BooleanTextoPipe } from './Pipes/boolean-texto.pipe';
import { ListarCursosComponent } from './Components/listar-cursos/listar-cursos.component';
import { SharedModule } from '../shared/shared.module';
import { CrearCursoComponent } from './Components/crear-curso/crear-curso.component';

@NgModule({
  declarations: [
    EditarCursoComponent,
    EliminarCursoComponent,
    CursosComponent,
    CursoProfileComponent,
    InscribirEstudianteComponent,
    BooleanTextoPipe,
    ListarCursosComponent,
    CrearCursoComponent 
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    CursosService
  ]

})
export class CursosModule { }
