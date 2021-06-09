import { Component, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { JobsApplied } from '../_models/jobs-applied';
import { JobsAppliedService } from '@app/_services';

@Component({
  selector: 'app-jobs-applied',
  templateUrl: './jobs-applied.page.html',
  styleUrls: ['./jobs-applied.page.scss'],
})
export class JobsAppliedPage implements OnInit {

  loadedBookings: JobsApplied[];

  constructor(
    private jobsApplicationService: JobsAppliedService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.jobsApplicationService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  onCancelApplication(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.jobsApplicationService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

}
