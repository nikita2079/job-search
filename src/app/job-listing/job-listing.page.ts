import { Component, OnInit, OnDestroy } from '@angular/core';
import { Joblisting } from '@app/_models';
import { Subscription, Observable } from 'rxjs';
import { MenuController, NavController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../_services/authentication.service';
import { JoblistingService } from '@app/_services/job-listing.service';
import { FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { JobBookmarksService } from '@app/_services';

@Component({
    selector: 'app-joblisting',
    templateUrl: './job-listing.page.html',
    styleUrls: ['./job-listing.page.scss'],
})
export class JoblistingPage implements OnInit, OnDestroy {
    loggedInUser: string;
    toastMessage: string;
    // NOTE load 5 listings on init
    slice = 5;

    loadedjobs: Joblisting[];
    listedLoadedjobs: Joblisting[];
    relevantjobs: Joblisting[];
    private jobsSub: Subscription;

    filter: FormControl;
    filter$: Observable<string>;
    listingsLength: number;
    lastCreatedListing: number;

    editMode = false;
    bookmarkState = [];

    constructor(
        private authenticationService: AuthenticationService,
        private jobBookmarksService: JobBookmarksService,
        public toastController: ToastController,
        private jobsService: JoblistingService,
        private menuCtrl: MenuController,
        private navCtrl: NavController
    ) {}

    ngOnInit() {
        this.jobsSub = this.jobsService.listings.subscribe(jobs => {
            this.loadedjobs = jobs;
            this.relevantjobs = this.loadedjobs;
            this.listedLoadedjobs = this.relevantjobs;
        });
    }

    ionViewWillEnter() {
        /**
         * get user Id
         */
        this.authenticationService.userId.subscribe(user => {
            this.loggedInUser = user;
        });
        /**
         * triggers fetchJoblistings() method in JoblistingService which fetches all the job listings from the api
         */
        this.jobsService.fetchJoblistings().subscribe(listings => {
            this.listingsLength = listings.length;
            this.lastCreatedListing = this.listingsLength - 1;
        });

        // Load bookmarks state from local storage.
        this.onCheckBookmarkState();
    }
    /**
     * open toggle menu
     */
    onOpenMenu() {
        this.menuCtrl.toggle();
    }

    /**
     * Load bookmarks state from local storage.
     */
    onCheckBookmarkState() {
        this.jobBookmarksService.loadBookmarksState().subscribe(data => {
            if (data === null || data === undefined) {
                // Triggered when there are no bookmarks. Could be used to present message to client
                return;
            }
            this.bookmarkState = data;
        });
    }

    /**
     * filter first job listing
     */
    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        if (event.detail.value === 'all') {
            this.relevantjobs = this.loadedjobs;
            this.listedLoadedjobs = this.relevantjobs.slice(1);
        } else {
            this.listedLoadedjobs = this.relevantjobs.slice(1);
        }
    }

    /**
     * only load a certain amount of listings at any given time
     */
    doInfinite(infiniteScroll) {
        setTimeout(() => {
            this.slice += 5;
            if (this.listingsLength) {
                // App logic to determine if all data is loaded
                // and disable the infinite scroll
                infiniteScroll.target.complete();
            }
        }, 500);
    }

    /**
     * Toast settings
     */
    async presentToast() {
        const toast = await this.toastController.create({
            message: this.toastMessage,
            color: 'medium',
            position: 'top',
            duration: 2000,
            buttons: [
                {
                    text: 'Done',
                    role: 'cancel',
                },
            ],
        });
        toast.present();
    }

    /**
     * Create persistent bookmark
     * On bookmark click we pass down the job details and store the details in local storage as 'bookmark'
     * local storage 'bookmark' gets called in job-bookmarks page and the data is displayed accordingly.
     */
    onBookmark(bookmarkKey, index: number) {
        // Check if bookmark exists. If it exists, remove it then presentToast with message 'job unsaved'
        if (localStorage['bookmark']) {
            const items = JSON.parse(localStorage['bookmark']);

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.id === bookmarkKey.id) {
                    this.toastMessage = 'Job unsaved!';
                    /**
                     * Get bookmarks from local storage and loop through all of them
                     * if bookmark exists then delete bookmark and bookmark_state
                     */
                    this.jobBookmarksService.localStorageBookmark();
                    // delete bookmark | delete method in service
                    this.jobBookmarksService.deleteBookmarkService(
                        bookmarkKey.id
                    );
                    // delete bookmark state value | delete method in service
                    this.jobBookmarksService.deleteBookmarkStateService(
                        bookmarkKey.id
                    );
                    // present toast with message 'job unsaved'
                    this.presentToast();
                    // update bookmark state with latest local storage values | this has to be placed here as event order matters
                    this.onCheckBookmarkState();
                    return;
                }
            }
        }

        // Else If bookmark does not exist, create new book mark and presentToast message 'Job saved'
        if (localStorage) {
            // create bookmark
            let bookmark;
            if (!localStorage['bookmark']) {
                bookmark = [];
            } else {
                bookmark = JSON.parse(localStorage['bookmark']);
            }
            if (!(bookmark instanceof Array)) {
                bookmark = [];
            }
            bookmark.push(bookmarkKey);
            localStorage.setItem('bookmark', JSON.stringify(bookmark));

            // create bookmark state id
            let bookmarkState;
            if (!localStorage['bookmark_state']) {
                bookmarkState = [];
            } else {
                bookmarkState = JSON.parse(localStorage['bookmark_state']);
            }
            bookmarkState.push(bookmarkKey.id);
            localStorage.setItem(
                'bookmark_state',
                JSON.stringify(bookmarkState)
            );
        }

        this.toastMessage = 'Job saved!';
        // update bookmark state with latest local storage values
        this.onCheckBookmarkState();
        // get bookmarks from local storage
        this.jobBookmarksService.localStorageBookmark();
        // present toast with 'desired message'
        this.presentToast();
    }

    // Triggerd when client clicks on more.
    onMore(id) {
        // navigate root so that on navigating back ionViewWillEnter can get triggered
        this.navCtrl.navigateRoot([`/job-detail/${id}`]);
    }

    /** SEARCH METHOD
     * Filter jobs on search input string change
     * NOTE search to be implemented on the backend
     */
    onSearch(event) {
        // If input value is 0, show all jobs
        if (event.detail.value.length === 0) {
            this.listedLoadedjobs = this.relevantjobs.slice(1);
        }
        // else show filtered job
        const filteredJobsTitle = this.listedLoadedjobs.filter(e =>
            e.title.toLowerCase().includes(event.detail.value)
        );
        this.listedLoadedjobs = filteredJobsTitle;
    }

    /** NOTE
     * Disposes the resources held by the subscription. May, for instance,
     * cancel an ongoing Observable execution or cancel any other type
     * of work that started when the Subscription was created.
     */
    ngOnDestroy() {
        if (this.jobsSub) {
            this.jobsSub.unsubscribe();
        }
    }
}
