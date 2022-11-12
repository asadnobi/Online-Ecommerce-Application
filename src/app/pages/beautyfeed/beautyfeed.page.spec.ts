import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BeautyfeedPage } from './beautyfeed.page';

describe('BeautyfeedPage', () => {
  let component: BeautyfeedPage;
  let fixture: ComponentFixture<BeautyfeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeautyfeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BeautyfeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
