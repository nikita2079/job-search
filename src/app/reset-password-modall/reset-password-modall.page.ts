import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reset-password-modall',
    templateUrl: './reset-password-modall.page.html',
    styleUrls: ['./reset-password-modall.page.scss'],
})

export class ResetPasswordModallPage implements OnInit {
    // Data passed in by componentProps
    @Input() emailAddress: string;

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
        private router: Router
    ) {}

    dismiss() {
        setTimeout(() => {
            // NOTE setTimout gives the router just enough time to make a smooth transition
            this.modalController.dismiss({
                'dismissed': true
              });
        }, 300);
        this.router.navigate(['/reset-password'], { state: { email: `${this.emailAddress}` } });
    }

    ngOnInit() {}
}
