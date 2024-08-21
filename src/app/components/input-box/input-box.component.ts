import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, forwardRef } from '@angular/core';
import {  NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value/control-value-accessor-directive.directive';
interface IconConfig {
  size?: number;
  color?: string;
}
type InputType = 'text' | 'number' | 'email' | 'password';
@Component({
  selector: 'app-input-box',
  standalone: true,
  templateUrl: './input-box.component.html',
  styleUrl: './input-box.component.scss',
  imports: [ReactiveFormsModule, CommonModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() =>InputBoxComponent),
    multi: true,
  }]
})

export class InputBoxComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputId = '';
  @Input() label!: string;
  @Input() formControl!: FormControl;
  @Input() type: InputType = 'text';
  @Input() invalid: boolean = false;
  @Input() icon: IconConfig = {
    size: 28,
    color: '#74a5a9',
  };
  protected hidePassword: boolean = true;
}
