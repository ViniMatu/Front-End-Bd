import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ComentariosComCliente } from '../../pages/card-page/card-page';

@Component({
  selector: 'app-card-modal',
  imports: [
    CommonModule
  ],
  templateUrl: './card-modal.html',
  styleUrl: './card-modal.scss'
})

export class CardModal implements OnInit, OnDestroy{
  @Input() titulo: string = "";
  @Input() nota: string = "";
  @Input() diretor: string = "";
  @Input() duracao: string = "";
  @Input() lancamento: string = "";
  @Input() sinopse: string ="";
  @Input() pais: string = '';
  @Input() genero: string = '';
  @Input() comentarios: ComentariosComCliente[] = [];

  @Output() fechar = new EventEmitter<void>();

  fecharModal() {
    this.fechar.emit();
  }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';  
  }
  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
