import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, tap, delay } from 'rxjs/operators';
import { JobsApplied } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class JobsAppliedService {
  private _bookings = new BehaviorSubject<JobsApplied[]>([]);

  get bookings() {
    return this._bookings.asObservable();
  }

  constructor() {}

  addBooking(
    jobId: string,
    jobTitle: string,
    jobImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new JobsApplied(
      Math.random().toString(),
      jobId,
      'userId',
      jobTitle,
      jobImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookings => {
        this._bookings.next(bookings.filter(b => b.id !== bookingId));
      })
    );
  }
}
