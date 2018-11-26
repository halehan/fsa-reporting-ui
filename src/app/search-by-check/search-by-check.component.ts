import { Component, Input, ViewChild, OnInit, AfterViewInit,  ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource , MatSort } from '@angular/material';

import { PurchaseOrder, Dealer, CityAgency, BidType, Payment, BidNumber,
  ItemBidTypeCode, PoStatusType, Specification, AgencyType } from '../model/index';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { SearchService } from '../services/search.service';
import { ToastrService } from 'ngx-toastr';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ItemPaymentComponent } from '../item-payment/item-payment.component';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-search-by-check',
  templateUrl: './search-by-check.component.html',
  styleUrls: ['./search-by-check.component.scss']
})
export class SearchByCheckComponent implements OnInit , AfterViewInit {

  itemColumns = ['bidNumber', 'poNumber', 'checkNumber', 'cityAgency',  'dealerName',
   'dateReported', 'poAmount', 'adminFeeDue'];

  displayColsGrouping  = ['paymentCheckNum', 'dealerName', 'POS',  'AdminFee'];



poDataSource = new MatTableDataSource();
poPaymentList = new MatTableDataSource();
poPaymentDetail = new MatTableDataSource();
purchaseOrders: PurchaseOrder[] = [];

selectedPO: PurchaseOrder;
selectedPoId: number;

enablePoList: boolean;
enablePoDetail: boolean;
enableItemList: boolean;
checkNumberForm: FormGroup;


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(private searchService: SearchService, private dateFormatPipe: DateFormatPipe ) {

    }

  ngOnInit() {
    this.checkNumberForm = this.createFormGroup();
  }

  createFormGroup() {

  return new FormGroup({ checkNumber: new FormControl()});
  }

  ngAfterViewInit() {

    this.poDataSource.sort = this.sort;
    this.poDataSource.paginator = this.paginator;
    this.enableItemList = false;


  }

  search() {
  //  filterValue = filterValue.trim(); // Remove whitespace
 //   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
 //   this.poDataSource.filter = filterValue;
    const checkNumber: string = this.checkNumberForm.controls.checkNumber.value;
    this.refreshPoList(checkNumber);
  }

  onItemRowClicked(row) {

  }

  onRowClicked(row) {

    this.selectedPO = row;

    this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
    this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);

   /*  this.searchService.getByCheckNumberDealer(row.paymentCheckNum, row.dealerName).subscribe(po => {
    
      this.poDataSource.data = po;
      this.enablePoList = true;

      console.log(po.length);

  }); */

  this.refreshItemList(row.paymentCheckNum, row.dealerName);


  }

  showFilter() {

    if (this.purchaseOrders.length > 0) {
        return true;
    } else {
        return false;
    }

  }

  filterBids(filterVal: string) {
    console.log(filterVal);

    this.refreshPoList(filterVal);
    this.selectedPO = null;

}

refreshItemList(checkNum: string, dealerName: string) {

  this.searchService.getByCheckNumberDealer(checkNum, dealerName).subscribe(_val => {
//    this.purchaseOrders = _val;
    this.poPaymentList.data = _val;
 //   this.enablePoList = true;
    this.enableItemList = true;

    console.log(_val.length);

});


}

  refreshPoList(checkNum: string) {

      this.searchService.getByCheckNumber(checkNum).subscribe(po => {
        this.purchaseOrders = po;
        this.poDataSource.data = po;
        this.enablePoList = true;

        console.log(this.purchaseOrders.length);

    });


  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }

  formatDate(dateVal: Date) {
    console.log(dateVal);
  //  dateVal.setHours(2);
    const myDate = this.dateFormatPipe.transform(dateVal);
    console.log(myDate);
    return myDate;

  }



}
