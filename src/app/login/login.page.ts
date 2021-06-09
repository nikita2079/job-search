import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '@app/_services';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    isLoading = false;
    loginError = null;

    emailAddress = '';

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private navCtrl: NavController,
        private loadingCtrl: LoadingController
    ) {
        // NOTE redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        // NOTE Receive email data from register component
        if (history.state.email) {
            this.emailAddress = history.state.email;
        } else {
            this.emailAddress = null;
        }
    }

    onSubmit(form: NgForm) {
        // NOTE stop here if form is invalid
        if (!form.valid) {
            return;
        }
        // NOTE if form is valid proceed
        const email = form.value.email;
        const password = form.value.password;
        this.onLogin(email, password);
        // form.reset();
    }

    onLogin(email: string, password: string) {
        // NOTE Display loading screen overlay
        this.loadingCtrl
            .create({ keyboardClose: true, message: 'Logging in...' })
            .then(loadingEl => {
                loadingEl.present();
                this.router.navigate(['/tabs/job-listing']);
                // NOTE subscribe to login response.
                // this.authService
                //     .login(email, password)
                //     .pipe(first()) // NOTE explain this to Phil: A pipe takes in data as input and transforms it to a desired output.
                //     .subscribe(
                //         data => {
                //             this.navCtrl.navigateRoot(['/tabs/job-listing'], {
                //                 queryParams: { registered: true },
                //             });
                //             loadingEl.dismiss();
                //         },
                //         error => {
                //             this.loginError = error;
                //             loadingEl.dismiss();
                //         }
                //     );
            });
    }
}
