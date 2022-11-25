import { style } from '@angular/animations';
import { Component, NgModuleFactory, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, ValidatorFn, AbstractControl, FormGroup, NgForm } from '@angular/forms'
import { Admin, alumno } from '../../../models/models';
import { Router } from '@angular/router';
import { AlumnosService } from '../../../alumnos/Services/alumnos.service';
import { Subscription } from 'rxjs';
import { AdminService } from '../../Services/admin.service';
@Component({
  selector: 'app-registro-login',
  templateUrl: './registro-login.component.html',
  styleUrls: ['./registro-login.component.css']
})
export class RegistroLoginComponent implements OnInit, OnDestroy {

  public admin: Admin;
  public alumno: alumno;
  public Admin!: boolean;
  public Alumno!: boolean;
  public primerForm: boolean;
  public Usuario!: string;
  public subscripcion!: Subscription;
  public Registro!: boolean;
  public Login: boolean = true;
  public imagenInicio: boolean = false;
  constructor(
    private router: Router,
    private alumnoServices: AlumnosService,
    private adminServices: AdminService
  ) {
    this.admin = { nombre: '', clave: '' };
    this.alumno = { _id: '', email: '', nombre: '', apellido: '', edad: 0, pais: '', sexo: '', clave: '' }
    this.primerForm = true;

  }

  ngOnInit(): void {
    console.log(document.querySelector('.acceder'));
  }

  ngOnDestroy(): void {
    //if(this.subscripcion) this.subscripcion.unsubscribe();

  }

  formUsuario(primerForm: NgForm) {
    console.log(primerForm.value.Usuario);
    let tipoUsuario = this.Usuario.toLowerCase()


    console.log(this.Usuario, tipoUsuario);
    if (tipoUsuario == 'administrador') {
      this.primerForm = false;
      this.Alumno = false;
      this.Admin = true;
      this.imagenInicio = true;
    } else if (tipoUsuario == 'alumno') {
      this.primerForm = false;
      this.Alumno = true;
      this.Admin = false;
      this.imagenInicio = true;
    }
  }


  adminForm(adminForm: NgForm) {
    console.log(this.admin);
    console.log(adminForm.value);
    this.primerForm = false;
    this.Alumno = false;
    this.Admin = false;
    this.adminServices.crearAdmin(this.admin).subscribe(
      res => {
        console.log(res);
        let token: any = JSON.stringify(res.token)
        localStorage.setItem('token', token);
        let admin = JSON.stringify(res.Admin)
        localStorage.setItem('usuarioLogueado', admin)

      }
    )

    setTimeout(() => {
      document.querySelector('.acceder')?.classList.add('cerrar');
      this.router.navigate(['/alumnos']);
    }, 1050);
  }


  RegistroForm(alumnoForm: NgForm) {
    console.log(this.alumno);
    console.log(alumnoForm.value);
    this.primerForm = false;
    this.Admin = false;
    this.alumnoServices.crearAlumno(this.alumno).subscribe(
      res => {
        console.log(res);
        if (res.yaExiste) {
          alert('Este usuario ya existe, intenta con otro');
          this.Alumno = true;
          return;
        }
        if (res.token && res.alumnoGuardado) {
          console.log(res.token);
          let token = JSON.stringify(res.token);
          localStorage.setItem('token', token);
          let usuario = JSON.stringify(res.alumnoGuardado)
          localStorage.setItem('usuarioLogueado', usuario);
          this.Alumno = false;
          this.alumno = res.alumnoGuardado;

          setTimeout(() => {
            document.querySelector('.acceder')?.classList.add('cerrar');
          }, 1000);
          this.router.navigate(['/alumnos']);
          return;
        }
      }
    )
  }


  llamarAlumnos() {
    this.subscripcion = this.alumnoServices.getAlumnos()
      .subscribe(
        res => {
          console.log(res);
        }
      )
  }

  loguinForm(form: NgForm) {
    console.log('Peticion para servicio de loguin')
    this.primerForm = false;
    this.Alumno = false;
    this.Admin = false;

    this.adminServices.loguinUsuario(this.alumno).subscribe(
      res => {
        console.log(res);

        if(res.noUser){
          alert('Este usuario no existe, registrate');
          this.Alumno = true;
          this.Login = false;
          this.Registro = true;
          return;
        }
        if(res[0].email && res[0].email.length >= 1){
          console.log('Si hay usuario y token');
          let token = JSON.stringify(res[1]);
          localStorage.setItem('token', token);
          let usuario = JSON.stringify(res[0])
          localStorage.setItem('usuarioLogueado', usuario);
          this.alumno = res.alumnoGuardado;
          setTimeout(() => {
            document.querySelector('.acceder')?.classList.add('cerrar');
          }, 1000);
          this.router.navigate(['/alumnos']);
          return;
        }
      }
    )

  }


  loguearme() {
    console.log('formulario para login');
    this.Registro = false;
    this.Login = true;
  }

  registrarme() {
    console.log('Form para')
    this.Registro = true;
    this.Login = false;
  }


}
