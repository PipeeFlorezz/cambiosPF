import { style } from '@angular/animations';
import { Component, NgModuleFactory, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators, ValidatorFn, AbstractControl, FormGroup, NgForm } from '@angular/forms'
import { Admin, alumno } from '../../../models/models';
import { Router } from '@angular/router';
import { AlumnosService } from '../../../alumnos/Services/alumnos.service';
import { Subscription } from 'rxjs';
import { AdminService } from '../../Services/admin.service';
interface Usuario {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-registro-login',
  templateUrl: './registro-login.component.html',
  styleUrls: ['./registro-login.component.css']
})
export class RegistroLoginComponent implements OnInit, OnDestroy {

  public dataSuccess!: boolean;
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
  public Usuarios: Usuario[];
  public elegirUsuario: FormGroup;
  constructor(
    private router: Router,
    private alumnoServices: AlumnosService,
    private adminServices: AdminService,
    private formBuilder: FormBuilder
  ) {
    this.admin = { nombre: '', clave: '' };
    this.alumno = { _id: '', email: '', nombre: '', apellido: '', edad: 0, pais: '', sexo: '', clave: '' }
    this.primerForm = true;

    this.Usuarios = [
      {value: 'usuario-0', viewValue: 'Administrador'},
      {value: 'usuario-1', viewValue: 'Alumno'},
    ];

    this.elegirUsuario = this.formBuilder.group({
      usuario: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    console.log(document.querySelector('.acceder'));
  }

  ngOnDestroy(): void {
    //if(this.subscripcion) this.subscripcion.unsubscribe();

  }

  formUsuario() {
    console.log(this.elegirUsuario.value)
    if (this.elegirUsuario.value.usuario == 'Administrador') {
      this.primerForm = false;
      this.Alumno = false;
      this.Admin = true;
    } else {
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
        this.dataSuccess = true;

      }
    )

    setTimeout(() => {
      document.querySelector('.acceder')?.classList.add('cerrar');
      this.router.navigate(['/alumnos']);
    }, 3000);
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
        if (res.token && res.token.length >= 1 && res.alumnoGuardado) {
          this.dataSuccess = true;
          console.log(res.token);
          let token = JSON.stringify(res.token);
          localStorage.setItem('token', token);
          let usuario = JSON.stringify(res.alumnoGuardado)
          localStorage.setItem('usuarioLogueado', usuario);
          this.Alumno = false;
          this.alumno = res.alumnoGuardado;

          setTimeout(() => {
            document.querySelector('.acceder')?.classList.add('cerrar');
          }, 3000);
          this.router.navigate(['/alumnos']);
          return;
        }
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
          this.dataSuccess = true;
          let token = JSON.stringify(res[1]);
          localStorage.setItem('token', token);
          let usuario = JSON.stringify(res[0])
          localStorage.setItem('usuarioLogueado', usuario);
          this.alumno = res.alumnoGuardado;
          setTimeout(() => {
            this.router.navigate(['/alumnos']);
            document.querySelector('.acceder')?.classList.add('cerrar');
          }, 3000);
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
