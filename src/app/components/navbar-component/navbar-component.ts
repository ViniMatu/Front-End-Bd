import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar, MatToolbarModule } from "@angular/material/toolbar";
import { ModalClientes } from '../modal-clientes/modal-clientes';
import { CommonModule } from '@angular/common';
import { ModalContato } from '../modal-contato/modal-contato';
import { ModalSobre } from '../modal-sobre/modal-sobre';

@Component({
  selector: 'app-navbar-component',
  imports: [
    CommonModule,
    MatToolbar,
    MatToolbarModule,
    MatButtonModule,
    ModalClientes,
    ModalContato,
    ModalSobre
],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss'
})
export class NavbarComponent {
  mostrarModalClientes: boolean = false;
  mostrarModalSobre: boolean = false;
  mostrarModalContato: boolean = false;

  abrirModalClientes() {
    this.mostrarModalClientes = true;
    document.body.classList.add('modal-aberto');
  }

  fecharModalClientes() {
    this.mostrarModalClientes = false;
    document.body.classList.remove('modal-aberto');
  }
  
  abrirModalSobre() {
    this.mostrarModalSobre = true;
    document.body.classList.add('modal-aberto');
  }

  fecharModalSobre() {
    this.mostrarModalSobre = false;
    document.body.classList.remove('modal-aberto');
  }

  abrirModalContato() {
    this.mostrarModalContato = true;
    document.body.classList.add('modal-aberto');
  }

  fecharModalContato() {
    this.mostrarModalContato = false;
    document.body.classList.remove('modal-aberto');
  }

}
