import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  public Admin: boolean;

  constructor(
    private router: Router
  ) {
    this.Admin = false;
  }

  ngOnInit(): void {
    let result: any = localStorage.getItem('usuarioLogueado');
    let usuarioLogueado = JSON.parse(result);
    if(usuarioLogueado.nombre == 'Administrador' || usuarioLogueado.nombre == 'administrador'){
      this.Admin = true;
    }
  }



  crearCurso(){
    console.log('crear curso')
    this.router.navigate(['/crearCurso']);

  }

}
