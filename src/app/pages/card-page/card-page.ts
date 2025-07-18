import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../components/card-component/card-component';
import { DynamoService } from '../../services/dynamo.service';

@Component({
  selector: 'app-card-page',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
  ],
  templateUrl: './card-page.html',
  styleUrls: ['./card-page.scss']
})
export class CardPage implements OnInit {
  filmes: any[] = [];

  constructor(private dynamoService: DynamoService) {}

  ngOnInit(): void {
    this.dynamoService.getAllMovies().then(result => {
      console.log(result)
      this.filmes = result || [];
    });
  }
}
