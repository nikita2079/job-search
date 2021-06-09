import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobBookmarksService {
    public bookmarkStorage: BehaviorSubject<any>;
    public bookmarkState: BehaviorSubject<any>;

    public bookmarks$: any;

    constructor() {}

    /** NOTE
     * Easily delete bookmakrs from any component.
     */
    deleteBookmarkService(bookmark_id: string) {
        let items = JSON.parse(localStorage['bookmark']);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.id === bookmark_id) {
                items.splice(i, 1);
            }
        }
        items = JSON.stringify(items);
        // store the result back in localStorage
        localStorage.setItem('bookmark', items);
    }
    /** NOTE
     * Easily delete bookmark state from any component.
     */
    deleteBookmarkStateService(bookmark_id: string) {
        let items = JSON.parse(localStorage['bookmark_state']);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item === bookmark_id) {
                items.splice(i, 1);
            }
        }
        items = JSON.stringify(items);
        // store the result back in localStorage
        localStorage.setItem('bookmark_state', items);
    }

    /** NOTE
     * Get bookmarks from local storage
     */
    localStorageBookmark() {
        if (JSON.parse(localStorage.getItem('bookmark')) === null) {
            return;
        }
        const localStorageBookmark = JSON.parse(
            localStorage.getItem('bookmark')
        );
        return (this.bookmarks$ = localStorageBookmark.length);
    }

    /** NOTE
     * Load bookmarks from local storage.
     * BehaviorSubject emits its current value whenever it is subscribed to.
     */
    loadBookmarks() {
        return (this.bookmarkStorage = new BehaviorSubject<any>(
            JSON.parse(localStorage.getItem('bookmark'))
        ));
    }

    /** NOTE
     * Load bookmarks state from local storage.
     * BehaviorSubject emits its current value whenever it is subscribed to.
     */
    loadBookmarksState() {
        return (this.bookmarkState = new BehaviorSubject<any>(
            JSON.parse(localStorage.getItem('bookmark_state'))
        ));
    }
}
