import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentAuthComponent } from './ident-auth.component';

describe('IdentAuthComponent', () => {
  let component: IdentAuthComponent;
  let fixture: ComponentFixture<IdentAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentAuthComponent],
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
