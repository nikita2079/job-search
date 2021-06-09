import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/_services';
import { AuthenticationService } from '@app/_services';
import { switchMap, first, catchError } from 'rxjs/operators';
import { NavController, AlertController } from '@ionic/angular';
import { GetUser } from '@app/_models';
import { CvService } from '@app/_services';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { UserCv } from '@app/_models';
import { SettingsService } from '@app/_services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: [
    './profile.page.scss'
  ]
})
export class ProfilePage implements OnInit {
  loggedInUser: string;
  hasCv: string | UserCv;
  error: string;
  hasCV$: any;
  hasCvLocal: any;

  private authSub: Subscription;
  private userCvSub: Subscription;

  isLoading = false;
  userData: GetUser;

  createUserCv: FormGroup;

  /** NOTE
  * ID's
  */
  sector_id: any;
  subsector_id: any;
  province_id: any;
  city_id: any;

  /** NOTE
* Results
*/
  sector: any;
  subsector: any;
  province: any;
  city: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private userService: UserService,
    private alertCtrl: AlertController,
    private cvService: CvService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) { }

  // checkCvStatus() {
  //   if (this.hasCvLocal === null) {
  //     console.log('profile.page.ts - 169 - this shit is null', this.hasCvLocal);
  //   } else if (this.hasCvLocal === undefined) {
  //     console.log('profile.page.ts - 69 - this shit is undefined', this.hasCvLocal);
  //   }
  // }

  ionViewWillEnter() {
    // this.checkCvStatus();
    /**NOTE
    * get user Id
    */
    this.authSub = this.authenticationService.userId.subscribe(user => {
      this.loggedInUser = user;
    });

    /**NOTE
    * Get logged in user cv
    */
    this.userCvSub = this.cvService.getUserCv(this.loggedInUser).subscribe(resp => {
      console.log('profile.page.ts - 86 - get cv', resp);

      // if (resp === null) {
      //   console.log('profile.page.ts - 89 - resp is undefined', resp);
      //   this.hasCvLocal = 'null';
      // }
      // TODO change hacLocalCV to settings
      // this.hasCvLocal = resp;
      this.hasCvLocal = resp.data.items[0];

      if (resp) {
        // FIXME issue: when profile page is loaded, user ID is sent to cv.service to retrieve cv. However, if there exists no cv
        // we get an error. This needs fixing.
        this.sector_id = resp.data.items[0].sector_id;
        this.subsector_id = resp.data.items[0].subsector_id;
        this.province_id = resp.data.items[0].province_id;
        this.city_id = resp.data.items[0].city_id;
        // this.sector_id = resp.sector_id;
        // this.subsector_id = resp.subsector_id;
        // this.province_id = resp.province_id;
        // this.city_id = resp.city_id;
      }

      if (resp === null) {
        return;
      } else {
        // NOTE Use dropdown to get cv params
        this.settingsService.getDropdowns().subscribe(resData => {
          console.log('profile.page.ts - 111 - dropdowns', resData);
          // NOTE SECTOR DATA
          const sectorData = resData.data.sectors.filter(data => data.id === this.sector_id);
          this.sector = sectorData[0];

          // NOTE SUB SECTOR DATA
          const subsectorData = this.sector.subsectors.filter(sector => sector.id === this.subsector_id);
          this.subsector = subsectorData[0];

          // NOTE Provinces
          const province = resData.data.provinces.filter(province => province.id === this.province_id);
          this.province = province[0];

          // NOTE Cities
          const city = this.province.cities.filter(city => city.id === this.city_id);
          this.city = city[0];
        });
      }

    });
  }

  ngOnInit() {
    this.createUserCv = this.formBuilder.group({
      active: [false],
    });

    /**NOTE
    * Check if route has user Id
    */
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) {
        this.navCtrl.navigateBack('/job-listing');
        return;
      }
      /**NOTE
      * Get current user Id from authentication service, if no user throw error
      */
      let fetchedUserId: string;
      this.authenticationService.userId
        .pipe(
          switchMap(userId => {
            if (!userId) {
              throw new Error('Found no user!');
            }
            fetchedUserId = userId;
            return this.userService.getUserById(paramMap.get('userId'));
          })
        )
        /**NOTE
        * Creates a new Observable, with this Observable as the source, and the passed
        * operator defined as the new observable's operator.
        */
        .subscribe(
          listing => {
            this.isLoading = false;
            this.userData = listing;
          },
          error => {
            this.error = error;
          }
        );
    });
  }



  onSubmit() {
    this.cvService.createUserCv(this.loggedInUser, this.createUserCv.value).pipe(first())
      /**NOTE
      * subscribe to response. If successful navigate user to cv create page.
      */
      .subscribe(data => {
        /* NOTE
        * Going **root** means that all existing pages in the stack will be removed,
        * and the navigated page will become the single page in the stack.
        */
        this.navCtrl.navigateRoot(['/cv-create', this.loggedInUser]);
      },
        /**NOTE
        * if response has error, present alert screen and return
        */
        error => {
          this.alertCtrl
            .create({
              header: 'An error ocurred!',
              message: 'Could not create CV.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.router.navigate(['/profile', this.loggedInUser]);
                  }
                }
              ]
            })
            .then(alertEl => alertEl.present());
        });
  }

  /**NOTE
  * Deletes logged in user CV
  */
  deleteCv() {
    this.cvService.deleteUserCv(this.loggedInUser)
      .subscribe(resData => {
        this.hasCvLocal = null;
      });
  }

  onUpdate() {
    this.navCtrl.navigateRoot(['/cv-update', this.loggedInUser]);
  }
  /**NOTE
  * Disposes the resources held by the subscription. May, for instance, cancel
  * an ongoing Observable execution or cancel any other type of work that
  * started when the Subscription was created.
  */
  ionViewWillLeave() {
    this.authSub.unsubscribe();
    this.userCvSub.unsubscribe();
  }

}


