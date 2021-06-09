import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-reset-password-modal',
    templateUrl: './reset-password-modal.page.html',
    styleUrls: ['./reset-password-modal.page.scss'],
})

export class ResetPasswordModalPage implements OnInit {
    // Data passed in by componentProps
    @Input() firstName: string;

    constructor(
        public modalController: ModalController,
        private navCtrl: NavController,
    ) {}

    dismiss() {
        setTimeout(() => {
            // NOTE setTimout gives the router just enough time to make a smooth transition
            this.modalController.dismiss({
                'dismissed': true
              });
        }, 300);
        this.navCtrl.navigateRoot(['/login']);
    }

    ngOnInit() {}
}
