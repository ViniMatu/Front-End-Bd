import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContato } from './modal-contato';

describe('ModalContato', () => {
  let component: ModalContato;
  let fixture: ComponentFixture<ModalContato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalContato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalContato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
