import { Status } from "./status.type";

export interface AdoptApplication {
    id: string;
    dogId: string;
    userId: string;
    status: Status;
}