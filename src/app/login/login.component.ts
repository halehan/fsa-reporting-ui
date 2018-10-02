import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(private userIdle: UserIdleService,
              private router: Router,
              private authenticationService: AuthenticationService) { }


  logout() {

    this.authenticationService.logout();

  }
              ngOnInit() {

    // reset login status
    this.authenticationService.logout();

      // Start watching for user inactivity.
    this.userIdle.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => // reset login status
    this.authenticationService.logout());
  //  console.log('Time is up!');

  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

  login() {
      this.loading = true;
      this.authenticationService.login(this.model.username, this.model.password)
          .subscribe(result => {
              if (result === true) {
                  this.router.navigate(['/dash']);
              } else {
                  this.error = 'Username or password is incorrect';
                  this.loading = false;
              }
          });
  }
}
