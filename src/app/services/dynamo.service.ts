import { Injectable } from '@angular/core';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { environment } from '../../environments/environment';

export interface MovieItem {
  PK: string;
  SK: string;
  title?: string;
  rating?: number;
  average_rating?: number;
  year?: number;
  genre?: string;
  country?: string;
  director?: string;
  imagem?: string;
  // adicione outros se quiser
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

  /**
   * Retorna todos os itens cujo SK = 'MOVIE'.
   * Para tabelas pequenas está ok; para grandes, considere GSI.
   */
  async getAllMovies(): Promise<MovieItem[]> {
    const params: ScanCommandInput = {
      TableName: 'Catalogo_Filmes',
      FilterExpression: 'SK = :movie',
      ExpressionAttributeValues: {
        ':movie': 'MOVIE',
      },
      // Opcional: projetar apenas o que você usa na UI:
      // ProjectionExpression: 'PK, SK, #t, rating, average_rating, year',
      // ExpressionAttributeNames: { '#t': 'title' }, // 'title' pode ser palavra reservada
    };

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
      console.error('Erro ao buscar filmes (Scan + Filter SK=MOVIE):', err);
      throw err;
    }
  }
}
