import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormGroupDirective,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    AuthenticationService,
    SettionsService,
    SettingsService,
} from '@app/_services';
import { LoadingController, NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { CvItemsService } from '../_services/cv-items.service';

@Component({
    selector: 'app-cv-create',
    templateUrl: './cv-create.page.html',
    styleUrls: ['./cv-create.page.scss'],
})
export class CvCreatePage implements OnInit {
    loggedInUser: string;
    error: string;

    createCvForm: FormGroup;
    submitted = false;
    loading = false;

    /** NOTE
     * Dropdowns
     */
    sectors: any[];
    subSectors: any[];
    provinces: any[];
    cities: any[];

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private navCtrl: NavController,
        private authenticationService: AuthenticationService,
        private cvItemService: CvItemsService,
        private loadingCtrl: LoadingController,
        private settionsService: SettionsService,
        private settingsService: SettingsService
    ) {}

    ionViewWillEnter() {
        // NOTE get logged in user id
        this.authenticationService.userId.subscribe(user => {
            this.loggedInUser = user;
        });

        // NOTE get all sectors & provinces
        this.settingsService.getDropdowns().subscribe(resData => {
            this.sectors = resData.data.sectors;
            this.provinces = resData.data.provinces;
        });
    }

    ngOnInit() {
        // NOTE create reactive CV form
        this.createCvForm = this.formBuilder.group({
            user_id: [''],
            sector_id: ['', Validators.required],
            subsector_id: ['', Validators.required],
            province_id: ['', Validators.required],
            city_id: ['', Validators.required],
            job_title: ['', Validators.required],
            comment: ['', Validators.required],
            months_employed: ['', Validators.required],
        });
    }

    // convenience getter for easy access to form fields
    get formFields(): any {
        return this.createCvForm.controls;
    }

    onBackButton() {
        this.router.navigate(['/tabs/profile', this.loggedInUser]);
    }

    onSubmit(formDirective: FormGroupDirective) {
        // create loading screen
        this.submitted = true;
        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Creating CV...' })
            .then(loadingEl => {
                loadingEl.present();
                if (this.createCvForm.invalid) {
                    loadingEl.dismiss();
                    return;
                }

                this.cvItemService
                    .createCvItem(this.loggedInUser, this.createCvForm.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            loadingEl.dismiss();
                            /* NOTE
                             * Going **root** means that all existing pages in the stack will be removed,
                             * and the navigated page will become the single page in the stack.
                             */
                            this.navCtrl.navigateRoot([
                                '/tabs/profile',
                                this.loggedInUser,
                            ]);
                            // this.router.navigate(['/tabs/profile', this.loggedInUser]);
                            formDirective.resetForm();
                            this.createCvForm.reset();
                        },
                        error => {
                            this.error = error;
                            loadingEl.dismiss();
                        }
                    );
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
            const result = resData.data.sectors.filter(
                data => data.id === event.detail.value
            );
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
            const result = resData.data.provinces.filter(
                data => data.id === event.detail.value
            );
            this.cities = result[0].cities;
            return;
        });
    }
}
