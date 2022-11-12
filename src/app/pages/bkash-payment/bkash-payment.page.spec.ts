import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BkashPaymentPage } from './bkash-payment.page';

describe('BkashPaymentPage', () => {
  let component: BkashPaymentPage;
  let fixture: ComponentFixture<BkashPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BkashPaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BkashPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
