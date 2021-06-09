import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem('currentUser'))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        // return this.http.post<any>(`http://localhost/api/auth/login?email=test%40gmail.com&password=test`, { email, password })
        return this.http
            .post<any>(
                `https://textile.incendiaryblue.com/api/auth/login`,
                { email, password }
            )
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                })
            );
    }

    get userId() {
        return this.currentUserSubject.asObservable().pipe(
            map(userData => {
                if (userData) {
                    return userData.user.id;
                } else {
                    return null;
                }
            })
        );
    }

    logout() {
        // remove user & bookmarks from local storage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('bookmark');
        localStorage.removeItem('bookmark_state');
        this.currentUserSubject.next(null);
    }
    // NOTE Register User
    register(user) {
        return this.http.post(
            `https://textile.incendiaryblue.com/api/auth/register`,
            user
        );
        // return this.http.post(`http://www.mocky.io/v2/5dcebdd5300000fd9f931c5f`, user);
    }
    // NOTE Verify user
    verify(email) {
        return this.http
            .post<any>(
                `https://textile.incendiaryblue.com/api/auth/verify`,
                email
            )
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                })
            );
        // return this.http.post(`http://www.mocky.io/v2/5dcebdd5300000fd9f931c5f`, email);
    }
    // NOTE send email to reset user password
    reset(user) {
        return this.http.post(
            `https://textile.incendiaryblue.com/api/auth/reset`,
            user
        );
        // return this.http.post(`http://www.mocky.io/v2/5dcebdd5300000fd9f931c5f`, user);
    }
    // NOTE reset user password
    resetPassword(user) {
        return this.http.post(
            `https://textile.incendiaryblue.com/api/auth/reset/password`,
            user
        );
        // return this.http.post(`http://www.mocky.io/v2/5dcebdd5300000fd9f931c5f`, user);
    }
}
