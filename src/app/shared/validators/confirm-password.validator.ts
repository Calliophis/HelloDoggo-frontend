import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { PasswordForm } from "../../features/user/components/password-input/password-form.model";

export function confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl<PasswordForm>): ValidationErrors | null => {
        
        if (control.value.password !== control.value.confirmPassword) {
            control.setErrors({ passwordDoesNotMatch: true })
            return { passwordDoesNotMatch: true }
        }
        if (control.hasError('passwordDoesNotMatch')) {
            control.setErrors(null)
        }
        return null;
    }
}