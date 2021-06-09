import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService } from '@app/_services';

import { User } from '@app/_models';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    currentUser: User;
    loggedInUser: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
        this.initializeApp();
        this.authenticationService.currentUser.subscribe(
            x => (this.currentUser = x)
        );
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
        // NOTE get user Id
        this.authenticationService.userId.subscribe(user => {
            this.loggedInUser = user;
        });
    }

    onLogout() {
        this.authenticationService.logout();
        this.router.navigateByUrl('/login');
    }
}
