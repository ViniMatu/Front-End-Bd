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
  @Input() imagem: string = '';

  @Output() cardClick = new EventEmitter<void>();

  onClick() {
    this.cardClick.emit();
  }

  getImageUrl(imgPath: string): string {
    if(imgPath.startsWith('s3')){
      return `${imgPath}`;
    }
    return imgPath;
  }
}
