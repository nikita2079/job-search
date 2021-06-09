import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';
import { MenuController } from '@ionic/angular';
import { Router, RouterEvent } from '@angular/router';
import { JoblistingService } from '../_services/job-listing.service';
import { JobBookmarksService } from '../_services/job-bookmarks.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
    loggedInUser: string;
    selectedPath: string;
    listingsLength: number;
    isClicked = false;
    bookmarksLength: any;

    constructor(
        private authenticationService: AuthenticationService,
        private jobBookmarksService: JobBookmarksService,
        private joblistingService: JoblistingService,
        public menuCtrl: MenuController,
        private router: Router
    ) {}

    ionViewWillEnter() {
        // NOTE get user Id
        this.authenticationService.userId.subscribe(user => {
            this.loggedInUser = user;
            this.router.events.subscribe((event: RouterEvent) => {
                if (event && event.url) {
                    this.selectedPath = event.url;
                }
            });
        });

        // Get job listings
        this.joblistingService.fetchJoblistings().subscribe(listings => {
            this.listingsLength = listings.length;
        });

        /** NOTE
         * using setInterval to detect change in number of bookmarks saved and unsaved
         */
        setInterval(() => {
            this.getBookmarks();
        }, 200);
    }

    /** NOTE
     * Get all bookmarks from bookmarks service
     */
    getBookmarks() {
        this.bookmarksLength = this.jobBookmarksService.localStorageBookmark();
    }

    // NOTE Opens the side Menu on click
    toggleMenu() {
        this.menuCtrl.toggle();
    }

    ngOnInit() {}

    checkUrl() {
        /** NOTE
         * Check if selected tab route matches logged in user ID
         * If it does, dynamically bind "tab-selected" class to ion-tab-button
         * this allows for selected tab to have color when active.
         */
        if (this.selectedPath === `/tabs/profile/${this.loggedInUser}`) {
            return true;
        }
    }
}
