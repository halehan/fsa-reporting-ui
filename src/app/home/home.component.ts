import { Component, OnInit} from '@angular/core';

import { User } from '../model/index';
import { Message } from '../model/index';
import { Content } from '../model/index';
import { UserService } from '../services/user.service';
import { ContentService } from '../services/content.service';
import { NavbarService } from '../navbar/navbar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  messages: Message[] = [];
  contents: Content[] = [];

  constructor(public nav: NavbarService, private contentService: ContentService, private userService: UserService ) { }

  ngOnInit() {
    this.nav.dashActive = '';
    this.nav.homeActive = 'active';
    this.nav.profileActive = '';
    this.nav.reportActive = '';
    this.nav.bidActive = '';
    this.nav.userActive = '';
    this.nav.show();

    this.contentService.getByName('HomePage').subscribe(res => {
      this.contents = res;
      console.log(res);

  });

  }

}
