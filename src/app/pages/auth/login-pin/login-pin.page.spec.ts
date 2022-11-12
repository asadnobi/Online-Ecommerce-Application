import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPinPage } from './login-pin.page';

describe('LoginPinPage', () => {
  let component: LoginPinPage;
  let fixture: ComponentFixture<LoginPinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPinPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
