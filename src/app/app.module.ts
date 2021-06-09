import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TabsPage } from './tabs/tabs.page';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { VerifyModalPage } from './verify-modal/verify-modal.page';
import { VerifyModalPageModule } from './verify-modal/verify-modal.module';
import { RegisterModalPage } from './register-modal/register-modal.page';
import { RegisterModalPageModule } from './register-modal/register-modal.module';
import { ResetPasswordModalPage } from './reset-password-modal/reset-password-modal.page';
import { ResetPasswordModalPageModule } from './reset-password-modal/reset-password-modal.module';
import { ResetPasswordModallPage } from './reset-password-modall/reset-password-modall.page';
import { ResetPasswordModallPageModule } from './reset-password-modall/reset-password-modall.module';

@NgModule({
  declarations: [AppComponent, TabsPage],
  entryComponents: [
    VerifyModalPage,
    RegisterModalPage,
    ResetPasswordModalPage,
    ResetPasswordModallPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    VerifyModalPageModule,
    ResetPasswordModalPageModule,
    ResetPasswordModallPageModule,
    RegisterModalPageModule,
    IonicModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
