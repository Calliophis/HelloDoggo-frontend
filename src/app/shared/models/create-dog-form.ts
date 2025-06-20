import { FormControl } from "@angular/forms";

export interface CreateDogForm {
    name: FormControl<string | null>;
    sex: FormControl<'male'|'female' | null>;
    breed: FormControl<string | null>;
    description: FormControl<string | null>;
    image: FormControl<string | null>;
}