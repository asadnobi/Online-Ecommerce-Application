import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VipPrivilegeDetailsPage } from './vip-privilege-details.page';

describe('VipPrivilegeDetailsPage', () => {
  let component: VipPrivilegeDetailsPage;
  let fixture: ComponentFixture<VipPrivilegeDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VipPrivilegeDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VipPrivilegeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
