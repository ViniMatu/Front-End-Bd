import { Injectable } from '@angular/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { ComentariosComCliente } from '../pages/card-page/card-page';

export interface MovieItem {
  PK: string;
  SK: string;
  title?: string;
  average_rating?: string;
  year?: string;
  genre?: string;
  country?: string;
  director?: string;
  imagem?: string;
  runtime?: string;
}

@Injectable({ providedIn: 'root' })
export class DynamoService {
  private client = new DynamoDBClient({
    region: environment.aws.region,
    credentials: {
      accessKeyId: environment.aws.accessKeyId,
      secretAccessKey: environment.aws.secretAccessKey,
    },
  });

  private docClient = DynamoDBDocumentClient.from(this.client);

  constructor() {}

  getAllMovies(): Observable<MovieItem[]> {
    const params: ScanCommandInput = {
      TableName: 'Catalogo_Filmes',
      FilterExpression: 'SK = :movie',
      ExpressionAttributeValues: {
        ':movie': 'MOVIE',
      },
      ProjectionExpression: 'PK, SK, title, average_rating',
    };

    const fetchMovies = async (): Promise<Pick<MovieItem, 'PK' | 'SK' | 'title' | 'average_rating'>[]> => {
      try {
        const command = new ScanCommand(params);
        const result = await this.docClient.send(command);

        let items: MovieItem[] = (result.Items ?? []) as MovieItem[];
        let lastKey = result.LastEvaluatedKey;
        while (lastKey) {
          const nextParams: ScanCommandInput = {
            ...params,
            ExclusiveStartKey: lastKey,
          };
          const nextResult = await this.docClient.send(
            new ScanCommand(nextParams)
          );
          items = items.concat((nextResult.Items ?? []) as MovieItem[]);
          lastKey = nextResult.LastEvaluatedKey;
        }
        return items;
      } catch (err) {
        console.error('Erro ao buscar filmes (Scan SK = MOVIE):', err);
        throw err;
      }
    };

    return from(fetchMovies());
  }

  getMovieById(PK: string, SK: string): Observable<MovieItem | null> {
    const params = {
      TableName: 'Catalogo_Filmes',
      Key: {PK, SK},
    };

    const fetchMovie = async (): Promise<MovieItem | null> => {
      try{
        const command = new GetCommand(params);
        const result = await this.docClient.send(command);
        return result.Item as MovieItem ?? null;
      } catch (err){
        console.error("Erro ao buscar filme por ID: ", err);
        return null;
      }
    }
    return from(fetchMovie());
  }

  getReviewsWithClientDetailsByMoviePK(PK: string): Observable<ComentariosComCliente[]> {
    const params: ScanCommandInput = {
      TableName: 'Catalogo_Filmes',
      FilterExpression: 'PK = :pk AND begins_with(SK, :reviewPrefix)',
      ExpressionAttributeValues: {
        ':pk': PK,
        ':reviewPrefix': 'REVIEW#',
      },
    };

    const fetchReviews = async (): Promise<ComentariosComCliente[]> => {
      try {
        const command = new ScanCommand(params);
        const result = await this.docClient.send(command);
        const reviews = result.Items ?? [];

        // Para cada review, buscar dados do cliente
        const fullReviews = await Promise.all(reviews.map(async (review: any) => {
          const clienteId = review.SK.split('#').slice(1).join('#'); // CLIENTE#001
          const clienteParams = {
            TableName: 'Catalogo_Filmes',
            Key: {
              PK: clienteId,
              SK: 'CLIENTE',
            },
          };
          try {
            const clienteResult = await this.docClient.send(new GetCommand(clienteParams));
            const clienteData = clienteResult.Item;
            return {
              ...review,
              cliente: clienteData?.['contato'] ?? null,
            };
          } catch (err) {
            console.error('Erro ao buscar cliente:', err);
            return {
              ...review,
              cliente: null,
            };
          }
        }));

        return fullReviews;
      } catch (err) {
        console.error('Erro ao buscar reviews:', err);
        return [];
      }
    };

    return from(fetchReviews());
  }
}