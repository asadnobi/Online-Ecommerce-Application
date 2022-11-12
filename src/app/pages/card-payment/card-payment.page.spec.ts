import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardPaymentPage } from './card-payment.page';

describe('CardPaymentPage', () => {
  let component: CardPaymentPage;
  let fixture: ComponentFixture<CardPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
