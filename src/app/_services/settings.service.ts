import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  /** NOTE
  * Get all the dropdowns
  */
  getDropdowns() {
    return this.http.get<any>(`https://textile.incendiaryblue.com/api/settings`)
      .pipe(map(resData => {
        return resData;
      }));
  }
}
