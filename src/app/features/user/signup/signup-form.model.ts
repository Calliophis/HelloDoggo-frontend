import { FormControl } from "@angular/forms";
import { PasswordForm } from "../components/password-input/password-form.model";

export interface SignupForm extends PasswordForm {  
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>; 
}