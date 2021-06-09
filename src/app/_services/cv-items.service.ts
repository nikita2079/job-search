import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CvItemsService {
    constructor(private http: HttpClient) { }

    /**NOTE
    create new user CV
    */
    createCvItem(user_id, user_cv) {
        return this.http.post(
            `https://textile.incendiaryblue.com/api/user/${user_id}/cv/item`,
            user_cv
        );
    }
    /**NOTE
    Update CV items
    */
    updateCvItems(user_id, cv_item_id, formFields) {
        return this.http.patch(
            `https://textile.incendiaryblue.com/api/user/${user_id}/cv/item/${cv_item_id}`,
            formFields
        );
    }
}
