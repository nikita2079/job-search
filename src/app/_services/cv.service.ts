import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { UserCv } from "@app/_models";
import { of, BehaviorSubject, Observable } from "rxjs";

interface UserCvInterface {
    data: any;
    city: string;
    comment: string;
    cv_id: string;
    deleted_at: string;
    id: string;
    job: string;
    months_employed: string;
    province: string;
    sector: string;
    sub_sector: string;
}

@Injectable({ providedIn: "root" })
export class CvService {
    constructor(private http: HttpClient) {}
    // create single user cv
    createUserCv(user_id, user_data) {
        return this.http.post(
            `https://textile.incendiaryblue.com/api/user/${user_id}/cv`,
            user_data
        );
    }

    getUserCv(user_id) {
        return this.http
        // cv interface comes from services
            .get<UserCvInterface>(
                `https://textile.incendiaryblue.com/api/user/${user_id}/cv`
            )
            .pipe(
                catchError(err => {
                    console.log("cv.service.ts - 55 - ", err);
                    return of(null);
                }),
                tap(evt => {
                    console.log("cv.service.ts - 37 - tap", evt);
                    if (
                        evt.data.items.length === 0 &&
                        evt.data.items.length !== null
                    ) {
                        return new UserCv(
                            evt.data.items.city,
                            evt.data.items.comment,
                            evt.data.items.cv_id,
                            evt.data.items.deleted_at,
                            evt.data.items.id,
                            evt.data.items.job_title,
                            evt.data.items.months_employed,
                            evt.data.items.province_id,
                            evt.data.items.sector_id,
                            evt.data.items.subsector_id
                        );
                    }
                    // return new UserCv(
                    //     evt.data.items[0].city,
                    //     evt.data.items[0].comment,
                    //     evt.data.items[0].cv_id,
                    //     evt.data.items[0].deleted_at,
                    //     evt.data.items[0].id,
                    //     evt.data.items[0].job_title,
                    //     evt.data.items[0].months_employed,
                    //     evt.data.items[0].province_id,
                    //     evt.data.items[0].sector_id,
                    //     evt.data.items[0].subsector_id
                    // );
                })
                // catchError(err => {
                //     console.log('cv.service.ts - 55 - ', err);
                //     return of(null);
                // })
                // map(resData => resData['data']),
                // map(resData => resData['items']),
                // map(resData => resData['0']),
                // tap(resData => {
                //     console.log('cv.service.ts - 41 - tap', resData);
                //     return new UserCv(
                //         resData.city,
                //         resData.comment,
                //         resData.cv_id,
                //         resData.deleted_at,
                //         resData.id,
                //         resData.job,
                //         resData.months_employed,
                //         resData.province,
                //         resData.sector,
                //         resData.sub_sector
                //     );
                // }),
                // catchError(err => {
                //     // console.log('cv.service.ts - 55 - ', err);
                //     return of(null);
                // })
            );
    }
    checkUserCv(user_id) {
        return this.http
            .get<any>(
                `https://textile.incendiaryblue.com/api/user/${user_id}/cv`
            )
            .pipe(
                map(resData => {
                    return resData.message;
                })
            );
    }

    deleteUserCv(user_id) {
        return this.http
            .delete(
                `https://textile.incendiaryblue.com/api/user/${user_id}/cv/delete`
            )
            .pipe(
                map(resData => {
                    return resData;
                })
            );
    }
}
