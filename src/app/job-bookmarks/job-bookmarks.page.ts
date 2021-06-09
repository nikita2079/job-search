import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JobBookmarksService } from '@app/_services';
import { ActionSheetController } from '@ionic/angular';

@Component({
    selector: 'app-job-bookmarks',
    templateUrl: './job-bookmarks.page.html',
    styleUrls: ['./job-bookmarks.page.scss'],
})
export class JobBookmarksPage implements OnInit {
    private bookmarkStorage: BehaviorSubject<any>;
    bookmarks: [];
    bookmarksLength: number;

    constructor(
        private jobBookmarksService: JobBookmarksService,
        private actionSheetCtrl: ActionSheetController
    ) {}

    /** NOTE
     * Methods in this function are triggered on page/component entry
     */
    ionViewWillEnter() {
        this.loadBookmarks();
        // this.bookmarksLength = this.bookmarks.length;
    }

    /** NOTE
     * Load bookmarks from bookmarks service.
     */
    loadBookmarks() {
        this.jobBookmarksService.loadBookmarks().subscribe(data => {
            this.bookmarks = data;
        });
    }

    /** NOTE
     * Pass bookmark id down to bookmark service and trigger delete method
     */
    onDeleteBookmark(bookmark_id) {
        this.actionSheetCtrl
            .create({
                header: 'Would you like to delete this bookmark?',
                buttons: [
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: () => {
                            this.jobBookmarksService.deleteBookmarkService(
                                bookmark_id
                            );
                            this.jobBookmarksService.deleteBookmarkStateService(
                                bookmark_id
                            );
                            this.loadBookmarks();
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                ],
            })
            .then(actionSheetEl => {
                actionSheetEl.present();
            });
    }

    onDeleteAllBookmarks() {
        this.actionSheetCtrl
            .create({
                header: 'Are you sure?',
                buttons: [
                    {
                        text: 'Delete',
                        role: 'destructive',
                        handler: () => {
                            localStorage.removeItem('bookmark');
                            localStorage.setItem(
                                'bookmark_state',
                                JSON.stringify([])
                            );
                            this.loadBookmarks();
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                    },
                ],
            })
            .then(actionSheetEl => {
                actionSheetEl.present();
            });
    }

    ngOnInit() {}
}
