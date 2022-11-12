import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecoveryPassPage } from './recovery-pass.page';

describe('RecoveryPassPage', () => {
  let component: RecoveryPassPage;
  let fixture: ComponentFixture<RecoveryPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryPassPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
