import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SignupDto } from "../models/signup.model";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LoginDto } from "../models/login.model";
import { Role } from "../models/role.type";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationApiService {
    #http = inject(HttpClient);

    signup(user: SignupDto): Observable<object> {
        return this.#http.post(`${environment.apiUrl}/auth/signup`, user);
    }

    login(user: LoginDto): Observable<{ accessToken: string, role: Role }> {
        return this.#http.post<{ accessToken: string, role: Role }>(`${environment.apiUrl}/auth/login`, user);
    }
}