import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const authReq = request.clone({ headers: request.headers.set('Authorization', localStorage.getItem('currentUser')) });

        return next.handle(request).pipe(
            tap(evt => {
                // console.log('error.interceptor.ts - 21 - ', evt);
                if (evt instanceof HttpResponse) {
                    if (Object.keys(evt.body)[0] === 'error' && evt.body.error === 'TOKEN_INVALID') {
                        console.log('error.interceptor.ts - 37 - ', 'ERROR CATCH HIT');
                        this.authenticationService.logout();
                        this.router.navigate(['/login']);
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.log('error.interceptor.ts - 30', error);
                if (error.status !== 401) {
                    // this.authenticationService.logout();
                    // 401 handled in auth.interceptor

                }
                if (error.error.status !== 404 && error.error.message === 'CV not found') {
                    console.log('error.interceptor.ts - 39 - my man the cv was not found', error);
                    // this.authenticationService.logout();
                    // 401 handled in auth.interceptor

                }
                // this.authenticationService.logout();
                // this.router.navigate(['/login']);
                return throwError(error);
            })
        );
    }
}
