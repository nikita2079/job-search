import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { ResetPasswordModalPage } from '@app/reset-password-modal/reset-password-modal.page';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
    resetPasswordForm: FormGroup;
    // NOTE Email data to be used as placeholder in template
    emailAddress = '';
    submitted = false;
    error: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: AuthenticationService,
        private loadingCtrl: LoadingController,
        public modalController: ModalController
    ) {}

    async presentModal() {
        const modal = await this.modalController.create({
            component: ResetPasswordModalPage,
            componentProps: {
                emailAddress: 'Douglas',
            },
        });
        return await modal.present();
    }

    ngOnInit() {
        // NOTE Receive email data from register component
        if (history.state.email) {
            this.emailAddress = history.state.email;
        } else {
            this.emailAddress = '';
        }

        // NOTE Verification Form
        this.resetPasswordForm = this.formBuilder.group({
            email: [`${this.emailAddress}`, Validators.required],
            token: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    // NOTE convenience getter for easy access to form fields
    get formFields(): any {
        return this.resetPasswordForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Reseting Password...' })
            .then(loadingEl => {
                loadingEl.present();
                if (this.resetPasswordForm.invalid) {
                    loadingEl.dismiss();
                    return;
                }

                // TODO  this.loading = true;
                this.userService
                    .resetPassword(this.resetPasswordForm.value)
                    .pipe(first())
                    .subscribe(
                        data => {
                            loadingEl.dismiss();
                            this.presentModal();
                            // this.router.navigate(['/login'], { queryParams: { registered: true }});
                            // this.resetPasswordForm.reset();
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
