import { Status } from "./status.type";

export interface AdoptApplication {
    id: string;
    dog: { id: string, name: string };
    user: { id: string, firstName: string, lastName: string, email: string };
    status: Status;
}