import { FormControl } from "@angular/forms";

export interface UpdateDogForm {
    name: FormControl<string>;
    sex: FormControl<'male'|'female'>;
    breed: FormControl<string>;
    description: FormControl<string>;
    image: FormControl<File | null>;
}