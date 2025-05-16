import { FormControl } from "@angular/forms";
import { PasswordForm } from "./password-form.model";

export interface SignupForm extends PasswordForm {  
  firstName: FormControl<string |null>;
  lastName: FormControl<string |null>;
  email: FormControl<string | null>; 
}