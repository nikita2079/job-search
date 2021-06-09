import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs/tabs.page';
// import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
    /**
     * Auth Routes
     */
    {
        path: 'login',
        loadChildren: './login/login.module#LoginPageModule',
    },
    {
        path: 'register',
        loadChildren: './register/register.module#RegisterPageModule',
    },
    {
        path: 'reset-password',
        loadChildren:
            './reset-password/reset-password.module#ResetPasswordPageModule',
    },
    {
        path: 'reset',
        loadChildren: './reset-password/reset/reset.module#ResetPageModule',
    },
    {
        path: 'verify',
        loadChildren: './verify/verify.module#VerifyPageModule',
    },
    /**
     * Jobs Routes
     */
    {
        path: 'job-detail/:jobId',
        loadChildren: './job-detail/job-detail.module#JobDetailPageModule',
        // canActivate: [AuthGuard],
    },

    {
        path: 'jobs-applied',
        loadChildren:
            './jobs-applied/jobs-applied.module#JobsAppliedPageModule',
        // canActivate: [AuthGuard],
    },
    /**
     * User Routes
     */
    {
        path: 'cv-update/:userId',
        loadChildren: './cv-update/cv-update.module#CvUpdatePageModule',
        // canActivate: [AuthGuard],
    },
    /**
     * CV Routes
     */
    {
        path: 'cv-create/:userId',
        loadChildren: './cv-create/cv-create.module#CvCreatePageModule',
        // canActivate: [AuthGuard],
    },

    /**
     * Tabs Routes
     */
    {
        path: 'tabs',
        component: TabsPage,
        // pathMatch: 'full',
        children: [
            // JOB ROUTES
            {
                path: 'job-listing',
                loadChildren:
                    './job-listing/job-listing.module#JoblistingPageModule',
                // Enable authentication guard
                // canActivate: [AuthGuard],
            },
            {
                path: 'profile/:userId',
                loadChildren: './profile/profile.module#ProfilePageModule',
                // canActivate: [AuthGuard],
            },
            {
                path: 'job-bookmarks',
                loadChildren:
                    './job-bookmarks/job-bookmarks.module#JobBookmarksPageModule',
                // canActivate: [AuthGuard],
            },
        ],
    },
    // otherwise redirect to home
    {
        path: '',
        redirectTo: 'tabs/job-listing',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
