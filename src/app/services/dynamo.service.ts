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

export interface ClienteItem {
  PK: string;
  SK: string;
  contato?: string;
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

  getAllClients(): Observable<ClienteItem[]> {
    const params: ScanCommandInput = {
      TableName: 'Catalogo_Filmes',
      FilterExpression: 'SK = :cliente',
      ExpressionAttributeValues: {
        ':cliente': 'CLIENTE',
      },
      ProjectionExpression: 'PK, SK, contato',
    };

    const fetchClientes = async (): Promise<Pick<ClienteItem, 'PK' | 'SK' | 'contato'>[]> => {
      try {
        const command = new ScanCommand(params);
        const result = await this.docClient.send(command);

        let items: ClienteItem[] = (result.Items ?? []) as ClienteItem[];
        let lastKey = result.LastEvaluatedKey;
        while (lastKey) {
          const nextParams: ScanCommandInput = {
            ...params,
            ExclusiveStartKey: lastKey,
          };
          const nextResult = await this.docClient.send(
            new ScanCommand(nextParams)
          );
          items = items.concat((nextResult.Items ?? []) as ClienteItem[]);
          lastKey = nextResult.LastEvaluatedKey;
        }
        return items;
      } catch (err) {
        console.error('Erro ao buscar filmes (Scan SK = MOVIE):', err);
        throw err;
      }
    };
    return from(fetchClientes());
  }

  getReviewsByClientPK(clientePK: string): Observable<ComentariosComCliente[]> {
    const reviewPrefix = `REVIEW#${clientePK}`;
    const params: ScanCommandInput = {
      TableName: 'Catalogo_Filmes',
      FilterExpression: 'begins_with(SK, :reviewPrefix)',
      ExpressionAttributeValues: {
        ':reviewPrefix': reviewPrefix,
      },
    };

    const fetchReviews = async (): Promise<ComentariosComCliente[]> => {
      try {
        // Buscar os comentários feitos pelo cliente
        const command = new ScanCommand(params);
        const result = await this.docClient.send(command);
        const reviews = result.Items ?? [];
        // Buscar os dados do cliente uma única vez
        const clienteParams = {
          TableName: 'Catalogo_Filmes',
          Key: {
            PK: clientePK,
            SK: 'CLIENTE',
          },
        };
        const clienteResult = await this.docClient.send(new GetCommand(clienteParams));
        const clienteData: ClienteItem = clienteResult.Item as ClienteItem;

        // Para cada review, buscar o título do filme (PK da review = MOVIE#014)
        const fullReviews = await Promise.all(reviews.map(async (review: any) => {
          const filmePK = review.PK;
          const filmeParams = {
            TableName: 'Catalogo_Filmes',
            Key: {
              PK: filmePK,
              SK: 'MOVIE',
            },
          };

          try {
            const filmeResult = await this.docClient.send(new GetCommand(filmeParams));
            const filmeTitle = filmeResult.Item?.['title'] ?? 'Filme não encontrado';

            return {
              cliente: clienteData,
              comment: review.comment,
              rating: review.rating,
              timestamp: review.timestamp,
              title: filmeTitle,
            };
          } catch (err) {
            console.error('Erro ao buscar título do filme:', err);
            return {
              cliente: clienteData,
              comment: review.comment,
              rating: review.rating,
              timestamp: review.timestamp,
              title: 'Erro ao buscar título',
            };
          }
        }));

        return fullReviews;
      } catch (err) {
        console.error('Erro ao buscar comentários do cliente:', err);
        return [];
      }
    };

    return from(fetchReviews());
  }
}