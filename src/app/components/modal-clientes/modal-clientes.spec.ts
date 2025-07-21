import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClientes } from './modal-clientes';

describe('ModalClientes', () => {
  let component: ModalClientes;
  let fixture: ComponentFixture<ModalClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
