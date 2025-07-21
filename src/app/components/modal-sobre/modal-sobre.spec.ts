import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSobre } from './modal-sobre';

describe('ModalSobre', () => {
  let component: ModalSobre;
  let fixture: ComponentFixture<ModalSobre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSobre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSobre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
