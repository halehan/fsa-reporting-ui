import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { HomeComponent } from './home/index';
import { AuthGuard } from './guards/index';
import { RegisterComponent } from './register/register.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { UserComponent } from './user/user.component';
import { AtableListComponent } from './atable-list/atable-list.component';
import { ReportsComponent } from './reports/reports.component';
import { PaymentSearchComponent } from './payment-search/payment-search.component';


const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
  //  { path: 'dash', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'paymentSearch', component: PaymentSearchComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'message', component: MessageComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'transaction', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
    { path: 'bids', component: PurchaseOrderComponent, canActivate: [AuthGuard] },
    { path: 'list', component: AtableListComponent, canActivate: [AuthGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'transactions/:bidId', component: PurchaseOrderComponent, canActivate: [AuthGuard]      },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
