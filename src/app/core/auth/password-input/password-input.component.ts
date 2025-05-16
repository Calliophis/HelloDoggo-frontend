import { booleanAttribute, Component, forwardRef, input } from '@angular/core';
import { passwordRules } from '../password.rules';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-input',
  imports: [
    PasswordModule,
    DividerModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule,
    CommonModule
  ],
  templateUrl: './password-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true
    }
  ]
})
export class PasswordInputComponent implements ControlValueAccessor, Validator {
  hasFeedback = input<boolean, string | boolean>(false, { transform: booleanAttribute });

  password: string = '';
  rules = passwordRules;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.password = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(value: string): void {
    this.password = value;
    this.onChange(value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.hasFeedback()) return null;

    const value = control.value || '';
    const failedRules = passwordRules.filter(rule => !rule.check(value)).map(rule => rule.key);

    return failedRules.length ? { isWeakPassword: {failedRules} } : null;
  }
}
