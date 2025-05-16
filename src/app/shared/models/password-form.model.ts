import { FormControl } from "@angular/forms";

export interface PasswordForm {
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}