import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormGroupDirective,
    FormControl,
} from '@angular/forms';
import { first, tap } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';
import { LoadingController, ModalController } from '@ionic/angular';
import { RegisterModalPage } from '@app/register-modal/register-modal.page';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    @ViewChild('ngForm') formGroupDirective: FormGroupDirective;

    registerForm: FormGroup;
    submitted = false;
    error: string;
    validationRequired = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: AuthenticationService,
        private loadingCtrl: LoadingController,
        public modalController: ModalController
    ) {
        // NOTE redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: RegisterModalPage,
            componentProps: {
                firstName: `${this.registerForm.value.first_name}`,
                emailAddress: `${this.registerForm.value.email}`,
            },
        });
        return await modal.present();
    }

    ngOnInit() {
        // NOTE create reactive registration form
        this.registerForm = this.formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(
                        '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
                    ),
                ])
            ),
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // NOTE convenience getter for easy access to form fields
    get formFields(): any {
        return this.registerForm.controls;
    }

    onSubmit() {
        this.submitted = true;

        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Registering...' })
            .then(loadingEl => {
                loadingEl.present();
                if (this.registerForm.invalid) {
                    loadingEl.dismiss();
                    return;
                }

                // NOTE this.loading = true;
                this.userService
                    .register(this.registerForm.value)
                    .pipe(
                        first(),
                        tap(data => {
                            // this.validationRequired = false;
                            // this.registerForm.reset();
                        })
                    )
                    .subscribe(
                        data => {
                            loadingEl.dismiss();
                            this.presentModal();
                            // FIXME form not reseting
                            this.validationRequired = false;
                            this.registerForm.reset();
                        },
                        error => {
                            this.error = error;
                            loadingEl.dismiss();
                        }
                    );
            });
    }
}
