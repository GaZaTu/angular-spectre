import { ButtonDirective } from './button.directive';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<button spectreButton>TEST</button>`
})
class ButtonDirectiveTestComponent { }

describe('ButtonDirective', () => {
  let component: ButtonDirectiveTestComponent
  let fixture: ComponentFixture<ButtonDirectiveTestComponent>
  let inputEl: DebugElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ButtonDirectiveTestComponent,
        ButtonDirective,
      ],
    })

    fixture = TestBed.createComponent(ButtonDirectiveTestComponent)
    component = fixture.componentInstance
    inputEl = fixture.debugElement.query(By.css('button'))
  })

  it('should create an instance', () => {

  })
})
