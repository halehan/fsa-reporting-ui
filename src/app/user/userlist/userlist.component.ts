import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import {MatTableDataSource , MatSort} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import { UserService } from '../../services/user.service';
import { User } from '../../model/index';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit,  AfterViewInit {

  displayedColumns = ['firstName', 'lastName', 'city', 'state', 'loginId', 'createdTime', 'actionsColumn'];
  userDataSource = new MatTableDataSource();
  users: User[] = [];

  selectedUser: User;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngAfterViewInit() {
    this.userDataSource.sort = this.sort;
  }

  onSelect(user: User): void {
    this.selectedUser = user;
  }

  ngOnInit() {

    this.userService.getAll()
    .subscribe(dogFace => {
        this.users = dogFace;
        this.userDataSource.data = dogFace;

    });

  }

  applyUserFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.userDataSource.filter = filterValue;
  }

  closeThread(user: User): void {

  }

  /*
  updateUser() {
    this.userService.update(this.selectedUser);
  }  */

  updateUser() {
        this.userService.update(this.selectedUser).subscribe(user => {
        this.selectedUser = user;
      });

        this.toastr.success('User Saved Successful', 'User Update', {
        timeOut: 2000,
});

      }


}
