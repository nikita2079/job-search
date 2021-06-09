import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
    NavController,
    ActionSheetController,
    AlertController,
    ToastController
} from "@ionic/angular";

import { Subscription } from "rxjs";
import { first, take, switchMap } from "rxjs/operators";
import {
    AuthenticationService,
    JoblistingService,
    LocationsService,
    CompanyService,
    JobBookmarksService
} from "@app/_services";
import { Joblisting } from "@app/_models";
import { Map, tileLayer, Marker, icon, marker } from "leaflet";

/** NOTE
 * This code fixes leaflet Marker icon
 */
const iconRetinaUrl = "assets/marker-icon-2x.png";
const iconUrl = "assets/marker-icon.png";
const shadowUrl = "assets/marker-shadow.png";
const iconDefault = icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;
/*******************************************************/

@Component({
    selector: "app-job-detail",
    templateUrl: "./job-detail.page.html",
    styleUrls: ["./job-detail.page.scss"]
})
export class JobDetailPage implements OnInit, OnDestroy {
    listing: Joblisting;
    isAppliable = false;
    isLoading = false;
    map: Map;
    error: any;
    companyLocation: any;
    private listingSub: Subscription;
    companyDetails: any;
    loggedInUser: string;
    toastMessage: string;
    bookmarkState = [];
    bookmarkId: any;

    constructor(
        private navCtrl: NavController,
        private route: ActivatedRoute,
        private actionSheetCtrl: ActionSheetController,
        private authenticationService: AuthenticationService,
        private joblistingService: JoblistingService,
        private locationsService: LocationsService,
        private companyService: CompanyService,
        private router: Router,
        public toastController: ToastController,
        private jobBookmarksService: JobBookmarksService
    ) {}

    ngOnInit() {}

    ionViewWillEnter() {
        /** NOTE
         * Check if route has jobId
         */
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has("jobId")) {
                this.navCtrl.navigateBack("/job-listing");
                return;
            }
            this.isLoading = true;
            this.bookmarkId = paramMap.get("jobId");

            /** NOTE
             * Get current user Id from authentication service, if no user throw error
             */
            let fetchedUserId: string;
            this.authenticationService.userId
                .pipe(
                    switchMap(userId => {
                        if (!userId) {
                            throw new Error("Found no user!");
                        }
                        this.loggedInUser = userId;
                        fetchedUserId = userId;
                        return this.joblistingService.getListing(
                            paramMap.get("jobId")
                        );
                    })
                )
                /** NOTE
                 * subscribe to geListing observable in job-listing service
                 */
                .subscribe(
                    listing => {
                        this.isLoading = false;
                        // pass data to this.listing
                        this.listing = listing;

                        // Get single location details
                        this.locationsService
                            .getLocation(listing.location_id)
                            .subscribe(resData => {
                                console.log(
                                    `job-detail.page.ts - 117 - this is where i am`,
                                    resData
                                );
                                this.companyLocation = resData.data;
                                this.leafletMap();
                            });

                        // Get Compnay details
                        this.companyService
                            .getCompany(listing.company_id)
                            .subscribe(resData => {
                                this.companyDetails = resData.data;
                                console.log(
                                    `job-detail.page.ts - 130 - this is the data`,
                                    this.companyDetails
                                );
                            });

                        this.isAppliable = listing.id !== fetchedUserId;
                    },
                    /**
                     * if errors, open alert control
                     */
                    error => {
                        this.error = error;
                    }
                );
        });

        // execute method on page enter
        this.onCheckBookmarkState();
    }

    onApply() {
        this.actionSheetCtrl
            .create({
                header: "Choose an Action",
                buttons: [
                    {
                        text: "Apply Now"
                    },
                    {
                        text: "Update CV",
                        handler: () => {
                            this.router.navigate([
                                "/cv-update",
                                this.loggedInUser
                            ]);
                        }
                    },
                    {
                        text: "Cancel",
                        role: "cancel"
                    }
                ]
            })
            .then(actionSheetEl => {
                actionSheetEl.present();
            });
    }

    leafletMap() {
        /**
         * In setView add latLng and zoom
         */
        this.map = new Map("map").setView(
            [`${this.companyLocation.lat}`, `${this.companyLocation.lng}`],
            15
        );
        tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "Textile Workers ©"
        }).addTo(this.map);

        marker([this.companyLocation.lat, this.companyLocation.lng])
            .addTo(this.map)
            .bindPopup(`${this.companyLocation.address}`)
            .openPopup();
    }

    async presentToast() {
        const toast = await this.toastController.create({
            message: this.toastMessage,
            color: "medium",
            position: "bottom",
            duration: 2000,
            buttons: [
                {
                    text: "Done",
                    role: "cancel"
                }
            ]
        });
        toast.present();
    }

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
     * On bookmark click we pass down the job detail and store the details in local storage as 'bookmark'
     * local storage 'bookmark' gets called in job-bookmarks page and the data is displayed accordingly.
     */
    onBookmark(bookmarkKey, index: number) {
        // Check if bookmark exists. If it exists, presentToast with message 'Bookmark exists'
        if (localStorage["bookmark"]) {
            const items = JSON.parse(localStorage["bookmark"]);

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.id === bookmarkKey.id) {
                    this.toastMessage = "Job unsaved!";

                    this.jobBookmarksService.localStorageBookmark();
                    // present toast with 'desired message'
                    this.presentToast();
                    // delete bookmark | delete method in service
                    this.jobBookmarksService.deleteBookmarkService(
                        bookmarkKey.id
                    );
                    // delete bookmark state value | delete method in service
                    this.jobBookmarksService.deleteBookmarkStateService(
                        bookmarkKey.id
                    );
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
            if (!localStorage["bookmark"]) {
                bookmark = [];
            } else {
                bookmark = JSON.parse(localStorage["bookmark"]);
            }
            if (!(bookmark instanceof Array)) {
                bookmark = [];
            }
            bookmark.push(bookmarkKey);
            localStorage.setItem("bookmark", JSON.stringify(bookmark));

            // create bookmark state id
            let bookmarkState;
            if (!localStorage["bookmark_state"]) {
                bookmarkState = [];
            } else {
                bookmarkState = JSON.parse(localStorage["bookmark_state"]);
            }
            bookmarkState.push(bookmarkKey.id);
            localStorage.setItem(
                "bookmark_state",
                JSON.stringify(bookmarkState)
            );
        }

        this.toastMessage = "Job saved!";
        // update bookmark state with latest local storage values
        this.onCheckBookmarkState();
        // get bookmarks from local storage
        this.jobBookmarksService.localStorageBookmark();
        // present toast with 'desired message'
        this.presentToast();
    }

    /**NOTE
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     */
    ionViewWillLeave() {
        /** Remove map when we have multiple map object */
        this.map.remove();
    }

    ngOnDestroy() {
        if (this.listingSub) {
            this.listingSub.unsubscribe();
        }
    }
}
