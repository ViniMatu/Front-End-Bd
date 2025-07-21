import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { ClienteItem, DynamoService } from '../../services/dynamo.service';
import { ComentariosComCliente } from '../../pages/card-page/card-page';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-clientes',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-clientes.html',
  styleUrl: './modal-clientes.scss'
})

export class ModalClientes {
  clientes: ClienteItem[] = [];
  clienteSelecionado: string = '';
  infoCliente: ComentariosComCliente[] = [];
  loadingClientes: boolean = true;
  
  @Output() fechar = new EventEmitter<void>();
  
  constructor(
    private dynamoService: DynamoService,
    private cd: ChangeDetectorRef
  ) {}

  fecharModalClientes() {
    this.fechar.emit();
  }

  ngOnInit() {
    this.dynamoService.getAllClients().subscribe((clientes) => {
      this.clientes = clientes;
      if (this.clientes.length > 0) {
        this.clienteSelecionado = this.clientes[0].PK;
        this.buscarInfoCliente();
      }
      this.loadingClientes = false;
      this.cd.detectChanges();
    });
  }

  onClienteChange() {
    if (this.clienteSelecionado) {
      this.buscarInfoCliente();
    }
  }

  buscarInfoCliente() {
    this.dynamoService.getReviewsByClientPK(this.clienteSelecionado)
      .subscribe(data => {
        this.infoCliente = data;
        this.cd.detectChanges();
      });
  }

}
