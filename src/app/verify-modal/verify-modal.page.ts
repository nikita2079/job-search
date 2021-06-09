import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-verify-modal',
    templateUrl: './verify-modal.page.html',
    styleUrls: ['./verify-modal.page.scss'],
})
export class VerifyModalPage implements OnInit {
    // Data passed in by componentProps
    @Input() firstName: string;
    @Input() lastName: string;
    @Input() middleInitial: string;

    constructor(
        public modalController: ModalController,
        private router: Router,
        private navCtrl: NavController
    ) {}

    dismiss() {
        setTimeout(() => {
            // NOTE setTimout gives the router just enough time to make a smooth transition
            this.modalController.dismiss({
                dismissed: true,
            });
        }, 300);
        this.navCtrl.navigateRoot(['/tabs/job-listing']);
    }

    ngOnInit() {}
}
