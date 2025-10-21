import { booleanAttribute, Component, forwardRef, input, signal } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { passwordRules } from '../../../../core/authentication/password.rules';

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
  label = input<string>('Password');
  
  password = '';
  rules = passwordRules;
  isDisabled = signal(false);

  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(value: string): void {
    this.password = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleInput(value: string): void {
    this.password = value;
    this.onChange(value);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.hasFeedback()) return null;
    if (control.pristine) return null;

    const value = control.value || '';
    const failedRules = passwordRules.filter(rule => !rule.check(value)).map(rule => rule.key);

    return failedRules.length ? { isWeakPassword: {failedRules} } : null;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }
}
