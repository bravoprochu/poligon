import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IdentModule } from 'otherModules/ident/ident.module';
import { IdentDataFactoryService } from 'otherModules/ident/services/ident-data-factory.service';

import { IdentAuthComponent } from './ident-auth.component';

describe('IdentAuthComponent', () => {
  let component: IdentAuthComponent;
  let fixture: ComponentFixture<IdentAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentAuthComponent],
      imports: [BrowserAnimationsModule, IdentModule],
      providers: [{ provide: IdentDataFactoryService, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
