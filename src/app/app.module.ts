import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule } from '@angular/http';

import { AuthGuard } from './guards/index';
import { UserService } from './services/user.service';
import { MessageService } from './services/message.service';
import { AuthenticationService } from './services/authentication.service';
import { AlertService} from './services/alert.service';
import { NavbarService } from './navbar/navbar.service';
import { ContentService } from './services/content.service';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { UserComponent } from './user/user.component';
import { ToastrModule } from 'ngx-toastr';
import { SimpleTimer } from 'ng2-simple-timer';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { MomentModule } from 'angular2-moment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserIdleModule } from 'angular-user-idle';
import { GoogleChartsModule } from 'angular-google-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { UserlistComponent } from './user/userlist/userlist.component';
import { AtableListComponent } from './atable-list/atable-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailComponent } from './purchase-order-detail/purchase-order-detail.component';
import { ReportsComponent } from './reports/reports.component';
import { DateFormatPipe } from './dateFormat/date-format-pipe.pipe';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    NavbarComponent,
    DashboardComponent,
    FooterComponent,
    MessageListComponent,
    MessageDetailComponent,
    ProfileComponent,
    MessageComponent,
    UserComponent,
    UserlistComponent,
    AtableListComponent,
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailComponent,
    ReportsComponent,
    DateFormatPipe,
  ],
  imports: [
    BsDatepickerModule.forRoot(),
    FontAwesomeModule,
    GoogleChartsModule,
    BrowserModule,
    FlexLayoutModule,
    CommonModule,
    BrowserAnimationsModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes)
    // and `ping` is 120 (2 minutes).
    UserIdleModule.forRoot({idle: 600, timeout: 300, ping: 12}),
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 20000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MomentModule,
    routing,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    UserService,
    MessageService,
    ContentService,
    AlertService,
    NavbarService,
    SimpleTimer,
    DateFormatPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
