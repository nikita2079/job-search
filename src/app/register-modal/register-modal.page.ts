import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register-modal',
    templateUrl: './register-modal.page.html',
    styleUrls: ['./register-modal.page.scss'],
})

export class RegisterModalPage implements OnInit {
    // Data passed in by componentProps
    @Input() firstName: string;
    @Input() emailAddress: string;

    constructor(
        public modalController: ModalController,
        private router: Router,
        private navCtrl: NavController,
    ) {}

    dismiss() {
        setTimeout(() => {
            // NOTE setTimout gives the router just enough time to make a smooth transition
            this.modalController.dismiss({
                'dismissed': true
              });
        }, 500);
        this.navCtrl.navigateRoot(['/verify'], { state: { email: `${this.emailAddress}` } });
    }

    ngOnInit() {}
  }
