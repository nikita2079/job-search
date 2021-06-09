import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormGroupDirective,
} from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { VerifyModalPage } from '../verify-modal/verify-modal.page';

@Component({
    selector: 'app-verify',
    templateUrl: './verify.page.html',
    styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {
    verificationForm: FormGroup;

    emailAddress = '';
    submitted = false;
    error: string;
    verifiedUser: any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: AuthenticationService,
        private loadingCtrl: LoadingController,
        public modalController: ModalController
    ) {}

    async presentModal() {
        const modal = await this.modalController.create({
            component: VerifyModalPage,
            componentProps: {
                firstName: `${this.verifiedUser}`,
            },
        });
        return await modal.present();
    }

    ngOnInit() {
        // NOTE Receive email data from register component
        if (history.state.email) {
            this.emailAddress = history.state.email;
        } else {
            this.emailAddress = null;
        }

        // NOTE Verification Form
        this.verificationForm = this.formBuilder.group({
            email: [`${this.emailAddress}`, Validators.required],
            verification_code: ['', Validators.required],
        });
    }

    // NOTE convenience getter for easy access to form fields
    get formFields(): any {
        return this.verificationForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Registering...' })
            .then(loadingEl => {
                loadingEl.present();
                if (this.verificationForm.invalid) {
                    loadingEl.dismiss();
                    return;
                }

                // TODO this.loading = true;
                this.userService
                    .verify(this.verificationForm.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            this.verifiedUser = data.user.first_name;
                            loadingEl.dismiss();
                            // this.router.navigate(['/tabs/job-listing']);
                            this.presentModal();
                            // this.verificationForm.reset();
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
