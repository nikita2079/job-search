import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// NOTE observable which allows for subscriptions: always gives the latest previously emmited values
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SettionsService {
    constructor(private http: HttpClient) { }

    /** NOTE
     * Get all the sectors
     */
    getSectors() {
        return this.http
            .get<any>(
                `https://textile.incendiaryblue.com/api/user/settings/sectors`
            )
            .pipe(
                map(resData => {
                    return resData;
                })
            );
    }
    /** NOTE
     * Get all the sub sectors
     */
    getSubSectors(sector_id) {
        return this.http
            .get<any>(
                `https://textile.incendiaryblue.com/api/user/settings/subsectors/${sector_id}`
            )
            .pipe(
                map(resData => {
                    return resData;
                })
            );
    }
    /** NOTE
     * Get all the provinces
     */
    getProvinces() {
        return this.http
            .get<any>(
                `https://textile.incendiaryblue.com/api/user/settings/provinces`
            )
            .pipe(
                map(resData => {
                    return resData;
                })
            );
    }
    /** NOTE
     * Get all the cities
     */
    getCities(province_id) {
        return this.http
            .get<any>(
                `https://textile.incendiaryblue.com/api/user/settings/cities/${province_id}`
            )
            .pipe(
                map(resData => {
                    return resData;
                })
            );
    }
}
