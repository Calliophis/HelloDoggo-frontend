import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

  getErrorText(control: AbstractControl | null): string | null {
    if (!control) {
      return null;
    }

    if (control.hasError('required')) {
      return 'This field is required';
    }

    if (control.hasError('minlength')) {
      return 'This field must contain at least 2 characters'
    }
    
    if (control.hasError('email')) {
      return 'This field must contain a valid email';
    }

    if (control.hasError('isOnlyWhiteSpace')) {
      return 'This field cannot be white space';
    }

    if (control.hasError('isWeakPassword')) {
      return 'Password is too weak';
    }

    if (control.hasError('passwordDoesNotMatch')) {
      return 'Password does not match';
    }

    return null;
  }
}
