import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';
import { ResetPasswordModallPage } from '@app/reset-password-modall/reset-password-modall.page';

@Component({
    selector: 'app-reset',
    templateUrl: './reset.page.html',
    styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
    resetForm: FormGroup;
    error: string;
    submitted = false;
    validationRequired = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: AuthenticationService,
        private loadingCtrl: LoadingController,
        public modalController: ModalController
    ) {}

    async presentModal() {
        const modal = await this.modalController.create({
            component: ResetPasswordModallPage,
            componentProps: {
                emailAddress: this.resetForm.value.email,
            },
        });
        return await modal.present();
    }

    ngOnInit() {
        // NOTE Verification Form
        this.resetForm = this.formBuilder.group({
            email: ['', Validators.required],
        });
    }

    // NOTE convenience getter for easy access to form fields
    get formFields(): any {
        return this.resetForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Sending Reset Email...' })
            .then(loadingEl => {
                loadingEl.present();
                if (this.resetForm.invalid) {
                    loadingEl.dismiss();
                    return;
                }

                // TODO this.loading = true;
                this.userService
                    .reset(this.resetForm.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            loadingEl.dismiss();
                            this.presentModal();
                            // this.router.navigate(['/reset-password'], { state: { email: `${this.resetForm.value.email}` } });
                            this.resetForm.reset();
                        },
                        error => {
                            this.error = error;
                            // TODO this.loading = false;
                            loadingEl.dismiss();
                        }
                    );
            });
    }
}
