import { Role } from "./role.type";

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role
}