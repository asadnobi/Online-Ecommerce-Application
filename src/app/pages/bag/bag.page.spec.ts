import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BagPage } from './bag.page';

describe('BagPage', () => {
  let component: BagPage;
  let fixture: ComponentFixture<BagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BagPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
