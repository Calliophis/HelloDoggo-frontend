import { FormControl } from "@angular/forms";

export interface CreateDogForm {
    name: FormControl<string>;
    sex: FormControl<'male'|'female' | null>;
    breed: FormControl<string>;
    description: FormControl<string>;
    image: FormControl<File | null>;
}