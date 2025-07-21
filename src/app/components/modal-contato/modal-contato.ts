import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-contato',
  imports: [],
  templateUrl: './modal-contato.html',
  styleUrl: './modal-contato.scss'
})
export class ModalContato {
  @Output() fechar = new EventEmitter<void>();

  fecharModalContato() {
    this.fechar.emit();
  }

}
