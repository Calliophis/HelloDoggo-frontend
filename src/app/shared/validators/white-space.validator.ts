import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function WhiteSpaceValidator(): ValidatorFn {
    return(control: AbstractControl): ValidationErrors | null => {
        const isSpace = /^\s+$/.test(control.value);
        
        if (control.value && isSpace) {
        return { isOnlyWhiteSpace: true };
        }

        return null
    }
}