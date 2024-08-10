import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVmComponent } from './edit-vm.component';

describe('EditVmComponent', () => {
  let component: EditVmComponent;
  let fixture: ComponentFixture<EditVmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
