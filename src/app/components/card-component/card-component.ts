import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-component',
  imports: [],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss'
})

export class CardComponent {
  @Input() titulo: string = '';
  @Input() notaFilme: string = '';
  @Input() imagemUrl: string = '/assets/svg/main-illustration.svg';

  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    this.cardClick.emit();
  }
}
