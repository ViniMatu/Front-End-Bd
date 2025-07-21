import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-sobre',
  imports: [],
  templateUrl: './modal-sobre.html',
  styleUrl: './modal-sobre.scss'
})
export class ModalSobre {
  @Output() fechar = new EventEmitter<void>();

  fecharModalSobre() {
    this.fechar.emit();
  }
}
