import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card-component/card-component';
import { DynamoService, MovieItem } from '../../services/dynamo.service';
import { CardModal } from '../../components/card-modal/card-modal';
import { Observable} from 'rxjs';

export interface ComentariosComCliente {
  cliente: { contato: string };
  comment: string;
  rating: string;
  timestamp: string;
}

interface FilmeComComentarios extends MovieItem {
  comment: ComentariosComCliente[]
}

@Component({
  selector: 'app-card-page',
  imports: [
    CommonModule,
    CardComponent,
    CardModal
  ],
  templateUrl: './card-page.html',
  styleUrls: ['./card-page.scss']
})

export class CardPage implements OnInit{
  filmes$!: Observable<MovieItem[]>;
  modalAberto: boolean = false;
  filmeSelecionado: FilmeComComentarios | null = null;
  
  constructor(
    private dynamoService: DynamoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.filmes$ =  this.dynamoService.getAllMovies();
  }

  abrirModal(filme: MovieItem) {
    const { PK, SK } = filme;

    this.dynamoService.getMovieById(PK, SK).subscribe((detalhes) => {
      if (detalhes) {
        this.dynamoService.getReviewsWithClientDetailsByMoviePK(PK).subscribe((comentarios) => {
          this.filmeSelecionado = {
            ...detalhes,
            comment: comentarios // <- adiciona os comentários com dados do cliente
          };
          this.modalAberto = true;
          this.cd.detectChanges();
        });
      } else {
        console.warn('Filme não encontrado.');
      }
    });
  }

  fecharModal() {
    this.modalAberto = false;
    this.filmeSelecionado = null;
  }
}
