import { Component, OnInit } from '@angular/core';
import { User } from '../model/index';
import { Message } from '../model/index';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';
import { MessageListComponent } from '../message-list/message-list.component';
import { NavbarService } from '../navbar/navbar.service';
import fontawesome from '@fortawesome/fontawesome';
import { faAddressBook, faCoins, faChartPie, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  faAddressBook = faAddressBook;
  faCoins = faCoins;
  faChartPie = faChartPie;
  faSignOutAlt = faSignOutAlt;

  chart = {
    title: 'Top 10 Providers',
    type: 'BarChart',
    is3D: true,
    data: [
      ['Duval Ford', 1597316.01],
      ['Don Reid Ford', 589563.39],
      ['Pierce Mfg. - Ten-8 Fire Equipment', 473086.38],
      ['Kenworth of Central Florida', 463275.77],
      ['Ring Power Corporation', 399483.92],
      ['Alan Jay Chevrolet, Buick, GMC, Cadillac', 349878.71],
      ['Hall-Mark Fire Apparatus', 341966.76],
      ['AutoNation CDJR of Pembroke Pines', 302707.02],
      ['Rush Truck Center', 293324.72],
    ],
    columnNames: ['Element', '$Dollars'],
    options: {
      is3D: true,
      animation: {
        duration: 250,
        easing: 'ease-in-out',
        startup: true
      }
    }
  };


  users: User[] = [];
  messages: Message[] = [];
  count = 0;
  title = '';

  constructor(public nav: NavbarService,
    private userService: UserService,
    private messageService: MessageService ) { }

  ngOnInit() {
     // get messages from secure api end point
     this.nav.show();
     this.nav.dashActive = 'active';
     this.nav.homeActive = '';
     this.nav.profileActive = '';
     this.nav.listActive = '';
     this.nav.bidActive = '';
     this.nav.userActive = '';
     this.nav.reportActive = '';
   /*  this.count = this.nav.getCount();
     this.messageService.getAll()
     .subscribe(messages => {
         this.messages = messages;

     }); */

     this.userService.getAll()
     .subscribe(users => {
         this.users = users;

     });
  }

}
