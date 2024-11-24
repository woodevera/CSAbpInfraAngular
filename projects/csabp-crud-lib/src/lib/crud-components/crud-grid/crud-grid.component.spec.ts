import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudGridComponent } from './crud-grid.component';

describe('CrudGridComponent', () => {
  let component: CrudGridComponent;
  let fixture: ComponentFixture<CrudGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
