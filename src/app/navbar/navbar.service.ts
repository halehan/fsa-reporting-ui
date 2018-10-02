import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class NavbarService {
  vis: boolean;
  count: number;
  active: string;
  homeActive = '';
  dashActive = '';
  profileActive = '';
  listActive = '';
  transactionActive = '';
  bidActive = '';
  reportActive = '';
  userActive = '';

    constructor(private authService: AuthenticationService) { this.vis = false; this.count = this.count + 1}

   getHomeActive() {return this.homeActive}
   getDashActive() {return this.dashActive}
   getProfileActive() {return this.profileActive}
   getListActive() {return this.listActive}
   getTransactionActive() {return this.transactionActive}

   getBidActive() {return this.bidActive}
   getReportActive() {return this.reportActive}
   getUserActive() {return this.userActive}

   logout() {

    this.authService.logout();

  }

    hide() { this.vis = false; this.count += 1; }

    show() { this.vis = true; this.count += 1; }

    getVisible() { return this.vis};

    getCount() {return this.count}

}
