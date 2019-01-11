import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
import { faSignOutAlt, faTachometerAlt, faHome, faChartPie, faAddressBook, faCoins } from '@fortawesome/free-solid-svg-icons';
import {HttpModule } from '@angular/http';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {NgIdleModule} from '@ng-idle/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  appTitle = ' FSA Cooperative Purchasing Program Reporting';
  appVersion = '1.0.11.RC-1'
  buildDate =  '1/10/2018 20:05:41'
  homeActive = '';
  dashActive = '';
  profileActive = '';
  bidActive = '';
  reportActive = '';
  userActive = '';
  listActive = '';
  searchActive = '';
  paymentsActive = '';
  vis: boolean;
  styleCls = '';

  faSignOutAlt = faSignOutAlt;
  faTachometerAlt = faTachometerAlt;
  faHome = faHome;
  faChartPie = faChartPie;
  faAddressBook = faAddressBook;
  faCoins = faCoins ;

  idleState = 'Not started.';
  timedOut = false;
  showContinue = false;



  constructor(private router: Router, private idle: Idle, private authenticationService: AuthenticationService,
    public nav: NavbarService ) {

      this.junk();

  }

  checkState () {

    return (this.idleState === 'Started');


  }

  junk() {

     // sets an idle timeout of 5 seconds, for testing purposes.
     this.idle.setIdle(1800);
     // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
     this.idle.setTimeout(120);
     // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
     this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

     this.idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
     this.idle.onTimeout.subscribe(() => {
     this.idleState = 'Timed out!';
       this.timedOut = true;
       this.authenticationService.logout();
       this.router.navigate(['/login']);
 
     });
     this.idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
     this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');
 
     // sets the ping interval to 15 seconds
    // keepalive.interval(15);
 
    // keepalive.onPing.subscribe(() => this.lastPing = new Date());
 
     this.reset();

  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started';
    this.timedOut = false;
    this.showContinue = false;
  }


  ngOnInit() {
    this.vis = this.nav.getVisible();
    this.styleCls = ((this.nav.getVisible()) ? '' : 'hiden');

    this.homeActive = this.nav.getHomeActive();
    this.dashActive = this.nav.getDashActive();
    this.profileActive = this.nav.getProfileActive();
    this.bidActive = this.nav.getBidActive();
    this.reportActive = this.nav.getReportActive();
    this.userActive = this.nav.getUserActive();
    this.searchActive = this.nav.getSearchActive();
    this.paymentsActive = this.nav.getPaymentsActive();

  }

  logout() {
    this.nav.logout();

  }

}
