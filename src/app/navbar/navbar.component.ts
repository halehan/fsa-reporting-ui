import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
import { faSignOutAlt, faTachometerAlt, faHome, faChartPie, faAddressBook, faCoins } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  appTitle = ' FSA Cooperative Purchasing Program Reporting';
  homeActive = '';
  dashActive = '';
  profileActive = '';
  bidActive = '';
  reportActive = '';
  userActive = '';
  listActive = '';
  vis: boolean;
  styleCls = '';

  faSignOutAlt = faSignOutAlt;
  faTachometerAlt = faTachometerAlt;
  faHome = faHome;
  faChartPie = faChartPie;
  faAddressBook = faAddressBook;
  faCoins = faCoins ;


  constructor(public nav: NavbarService ) {}

  ngOnInit() {
    this.vis = this.nav.getVisible();
    this.styleCls = ((this.nav.getVisible()) ? '' : 'hiden');

    this.homeActive = this.nav.getHomeActive();
    this.dashActive = this.nav.getDashActive();
    this.profileActive = this.nav.getProfileActive();
    this.bidActive = this.nav.getBidActive();
    this.reportActive = this.nav.getReportActive();
    this.userActive = this.nav.getUserActive();

  }

  logout() {
    this.nav.logout();

  }

}
