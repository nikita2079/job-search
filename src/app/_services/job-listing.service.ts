import { Injectable } from '@angular/core';
import { take, map, tap, delay } from 'rxjs/operators';
import { Joblisting } from '@app/_models';

// NOTE observable which allows for subscriptions: always gives the latest previously emmited values
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface JoblistingData {
    id: string;
    listing_type_id: string;
    company_id: string;
    employer_id: string;
    location_id: string;
    title: string;
    summary: string;
    description: string;
    expires: string;
    status: string;
    deleted_at: string;
}

@Injectable({
    providedIn: 'root',
})
export class JoblistingService {
    constructor(private http: HttpClient) { }
    // NOTE  <> describes generic type and which type of data will eventually endup there
    // private placesModel: Place[] = new BehaviorSubject<Place[]>()  BEFORE / AFTER is below
    private joblistingModel = new BehaviorSubject<Joblisting[]>([]);

    get listings() {
        return this.joblistingModel.asObservable();
    }

    fetchJoblistings() {
        return (
            this.http
                .get<{ [key: string]: JoblistingData }>(
                    `https://textile.incendiaryblue.com/api/listings`
                )
                // map() takes the response of the observable and allows us to return new data that will be wrapped in an observable
                // switchMap returns a new observable, map returns non observable data.
                .pipe(
                    map(resData => {
                        const listings = [];
                        for (const key in resData.data) {
                            if (resData.data.hasOwnProperty(key)) {
                                listings.push(
                                    new Joblisting(
                                        resData.data[key].id,
                                        resData.data[key].listing_type_id,
                                        resData.data[key].company_id,
                                        resData.data[key].employer_id,
                                        resData.data[key].location_id,
                                        resData.data[key].title,
                                        resData.data[key].summary,
                                        resData.data[key].description,
                                        resData.data[key].expires,
                                        resData.data[key].status,
                                        resData.data[key].deleted_at
                                    )
                                );
                            }
                        }
                        return listings;
                    }),
                    tap(listings => {
                        this.joblistingModel.next(listings);
                    })
                )
        );
    }

    getListing(id: string) {
        // This is where we get a single place demo listings
        // return subscribable subject, map(gets what take(gives us))
        return this.http
            .get<JoblistingData>(
                `https://textile.incendiaryblue.com/api/listings/${id}`
            )
            .pipe(
                map(data => data['data']),
                map(listingData => {
                    return new Joblisting(
                        id,
                        listingData.listing_type_id,
                        listingData.company_id,
                        listingData.employer_id,
                        listingData.location_id,
                        listingData.title,
                        listingData.summary,
                        listingData.description,
                        listingData.expires,
                        listingData.status,
                        listingData.deleted_at
                    );
                })
            );
    }
}
