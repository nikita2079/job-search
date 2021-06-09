import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthenticationService, CvService } from '@app/_services';
import { UserCv } from '../_models/user-cv';
import { first } from 'rxjs/operators';
import { CvItemsService } from '../_services/cv-items.service';
import { SettingsService } from '../_services/settings.service';

@Component({
  selector: 'app-cv-update',
  templateUrl: './cv-update.page.html',
  styleUrls: ['./cv-update.page.scss'],
})
export class CvUpdatePage implements OnInit {

  updateCvForm: FormGroup;
  loggedInUser: string;
  userCv: any;

  submitted = false;
  error: string;

  /** NOTE
  * ID's passed down to dropdown methods that trigger api call.
  */
  sector_id: any;
  subsector_id: any;
  province_id: any;
  city_id: any;

   /** NOTE
  * Drop local state
  */
  sectorName: any;
  subsectorName: any;
  provinceName: any;
  cityName: any;

  /** NOTE
  * Dropdowns
  */
  sectors: any[];
  subSectors: any[];
  provinces: any[];
  cities: any[];

  private authSub: Subscription;
  private userCvSub: Subscription;

  constructor(
    private authenticationService: AuthenticationService ,
    private navCtrl: NavController,
    private cvService: CvService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private cvItemsService: CvItemsService,
    private settingsService: SettingsService
  ) {}

  ionViewWillEnter() {
    // NOTE get user Id
    this.authSub = this.authenticationService.userId.subscribe(user => {
      this.loggedInUser = user;
    });
    /**NOTE
    * Get logged in user cv
    */
    this.userCvSub = this.cvService.getUserCv(this.loggedInUser).subscribe(res => {
      console.log('cv-update.page.ts - 71 - ', res);
      // API CV values
      this.userCv = res.data.items[0];
      // this.userCv = res;
      // NOTE set initial form values to current user values
      this.sector_id = res.data.items[0].sector_id;
      this.subsector_id = res.data.items[0].subsector_id;
      this.province_id = res.data.items[0].province_id;
      this.city_id = res.data.items[0].city_id;

      // NOTE Use dropdown to get cv params
      this.settingsService.getDropdowns().subscribe(resData => {
        console.log('cv-update.page.ts - 81 - ', resData);
        this.sectors = resData.data.sectors;
        this.provinces = resData.data.provinces;
        // NOTE SECTOR DATA
        const sectorData = resData.data.sectors.filter(data => data.id === this.sector_id);
        this.sectorName = sectorData[0];

        // NOTE SUB SECTOR DATA
        const subsectorData = this.sectorName.subsectors.filter(sector => sector.id === this.subsector_id);
        this.subsectorName = subsectorData[0];

        // NOTE Provinces
        const province = resData.data.provinces.filter(filteredData => filteredData.id === this.province_id);
        this.provinceName = province[0];

        // NOTE Cities
        const city = this.provinceName.cities.filter(filteredData => filteredData.id === this.city_id);
        this.cityName = city[0];

        /** NOTE Pass down sector ID and province ID to methods below.
        * This preloads subsecor and city dropdowns when update page loads
        */
        this._onSectors(this.sector_id);
        this._onProvinces(this.province_id);

        // NOTE set initial editable form values when the update form is initially loaded.
        this.updateCvForm.setValue({
          sector_id : this.sector_id,
          subsector_id : this.subsector_id,
          province_id : this.province_id,
          city_id : this.city_id,
          job_title : this.userCv.job_title,
          comment : this.userCv.comment,
          months_employed : this.userCv.months_employed
        });
      });
    });

  }

  ngOnInit() {
    // NOTE create reactive update CV form
    this.updateCvForm = this.formBuilder.group({
      sector_id: ['', Validators.required],
      subsector_id: ['', Validators.required],
      province_id: ['', Validators.required],
      city_id: ['', Validators.required],
      job_title: ['', Validators.required],
      comment: ['', Validators.required],
      months_employed: ['', Validators.required]
    });
  }

  // NOTE convenience getter for easy access to form fields
  get formFields(): any {
    return this.updateCvForm.value;
  }

  onSubmit(formDirective: FormGroupDirective) {
    this.submitted = true;

    this.loadingCtrl
    .create({ keyboardClose: true, message: 'Updating...' })
    .then(loadingEl => {
      loadingEl.present();
      if (this.updateCvForm.invalid) {
          loadingEl.dismiss();
          return;
      }

    /** NOTE UpdateCvItems method takes in 3 params:
    * 1. logged in user ID
    * 2. logged in user CV ID
    * 3. logged in user form fields
    */
    this.cvItemsService.updateCvItems(this.loggedInUser, this.userCv.id, this.formFields)
        .pipe(first())
        .subscribe(
            data => {
                loadingEl.dismiss();
                this.navCtrl.navigateRoot(['/tabs/profile', this.loggedInUser]);
                this.updateCvForm.reset();
            },
            error => {
                this.error = error;
                loadingEl.dismiss();
            });
    });
  }

  /** NOTE
  * On dropdown select we pass down the sector_id as event.
  * We filter through response data using the event/sector_id
  */
  _onSectors(event) {
    if (event === undefined || event === '') {
      return;
    }
    this.settingsService.getDropdowns().subscribe(resData => {
      const result = resData.data.sectors.filter(data => data.id === event);
      this.subSectors = result[0].subsectors;
      return;
    });
  }
  /** NOTE
  * On dropdown select we pass down the province_id as event.
  * We filter through resonse data using the event
  */
  _onProvinces(event) {
    if (event === undefined || event === '') {
      return;
    }
    this.settingsService.getDropdowns().subscribe(resData => {
      const result = resData.data.provinces.filter(data => data.id === event);
      this.cities = result[0].cities;
      return;
    });
  }

  /** NOTE
  * On dropdown select we pass down the sector_id as event.
  * We filter through response data using the event
  */
  onSectors(event) {
    if (event.detail.value === undefined || event.detail.value === '') {
      return;
    }
    this.settingsService.getDropdowns().subscribe(resData => {
      const result = resData.data.sectors.filter(data => data.id === event.detail.value);
      this.subSectors = result[0].subsectors;
      return;
    });
  }
  /** NOTE
  * On dropdown select we pass down the province_id as event.
  * We filter through response data using the event
  */
  onProvinces(event) {
    if (event.detail.value === undefined || event.detail.value === '') {
      return;
    }
    this.settingsService.getDropdowns().subscribe(resData => {
      const result = resData.data.provinces.filter(data => data.id === event.detail.value);
      this.cities = result[0].cities;
      return;
    });
  }
}
