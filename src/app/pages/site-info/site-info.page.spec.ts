import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SiteInfoPage } from './site-info.page';

describe('SiteInfoPage', () => {
  let component: SiteInfoPage;
  let fixture: ComponentFixture<SiteInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SiteInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
