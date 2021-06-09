import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

// NOTE observable which allows for subscriptions: always gives the latest previously emmited values
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  /** NOTE
  * Get a single location
  */
  getCompany(company_id) {
    return this.http.get<any>(`https://textile.incendiaryblue.com/api/companies/${company_id}`)
      .pipe(map(resData => {
        return resData;
      }));
  }
}
