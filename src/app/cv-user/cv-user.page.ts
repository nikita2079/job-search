import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserCv } from '@app/_models';
import { NavController, ActionSheetController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, CvService } from '@app/_services';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-cv-user',
  templateUrl: './cv-user.page.html',
  styleUrls: ['./cv-user.page.scss'],
})
export class CvUserPage implements OnInit {
  @Input() userId: any;
  @Input() hasCV: any;
  @Output() cvDelete = new EventEmitter();

  @Input() sector: any;
  @Input() sub_sector: any;
  @Input() province: any;
  @Input() city: any;

  loggedInUserCv: UserCv;
  loggedInUser: string;

  isLoading = false;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private authenticationService: AuthenticationService,
    private alertCtrl: AlertController,
    private router: Router,
    private cvService: CvService,
  ) {}

  ngOnInit() {}
  // NOTE  delete CV
  clickDelete() {
    this.alertCtrl
    .create({
      header: 'Are you sure?',
      // message: 'Could not load user.',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.cvDelete.emit(true);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
    .then(alertEl => alertEl.present());
    }
}
