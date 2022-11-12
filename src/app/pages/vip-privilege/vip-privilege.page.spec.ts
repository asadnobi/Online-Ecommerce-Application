import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VipPrivilegePage } from './vip-privilege.page';

describe('VipPrivilegePage', () => {
  let component: VipPrivilegePage;
  let fixture: ComponentFixture<VipPrivilegePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VipPrivilegePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VipPrivilegePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
