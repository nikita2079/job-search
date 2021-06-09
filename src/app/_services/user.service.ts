import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GetUser } from '@app/_models/user-get';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getUserById(id) {
        return (
            this.http
                .get<GetUser>(
                    `https://textile.incendiaryblue.com/api/user/${id}`
                )
                // return this.http.post(`http://www.mocky.io/v2/5dcebdd5300000fd9f931c5f`, id);
                .pipe(
                    map(data => data['data']),
                    map(userData => {
                        return new GetUser(
                            id,
                            userData.first_name,
                            userData.last_name,
                            userData.email,
                            userData.status,
                            userData.phone
                        );
                    })
                )
        );
    }
}
