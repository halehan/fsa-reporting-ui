
import { Component, ViewChild, OnInit, AfterViewInit,  ElementRef } from '@angular/core';

import {MatPaginator, MatTableDataSource , MatSort } from '@angular/material';

import { PurchaseOrder, Dealer, CityAgency, BidType, Payment, BidNumber,
  ItemBidTypeCode } from '../model/index';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ItemPaymentComponent } from '../item-payment/item-payment.component';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemService } from '../services/item.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})


export class PaymentListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['bidNumber', 'cityAgency',  'dealerName', 'poNumber',
                      'dateReported', 'poIssueDate', 'poAmount', 'adminFeeDue'];
  itemColumns = ['itemNumber', 'itemDescription',  'itemType', 'itemMake', 'itemModel', 'qty', 'itemAmount'];

  poDataSource = new MatTableDataSource();
  itemListDS = new MatTableDataSource();
  purchaseOrders: PurchaseOrder[] = [];

  bidNumbers: BidNumber[] = [];
  bidTypes: BidType[] = [];
  bids: String[] = [];

  selectedPO: PurchaseOrder;

  currentBid: BidNumber;

  bidId: String;
  bidType: string;
  enableItemDetail: boolean;
  enableItemList: boolean;

  @ViewChild('poFocus') poFocus: ElementRef;
  @ViewChild('paymentFocus') paymentFocus: ElementRef;

  @ViewChild(ItemPaymentComponent) item: ItemPaymentComponent;
  @ViewChild(ItemListComponent) itemList: ItemListComponent;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private poService: PurchaseOrderService, private itemService: ItemService, 
              private dateFormatPipe: DateFormatPipe ) {

                this.enableItemDetail = false;

}

getItems(poId: number) {

  this.enableItemDetail = false;

  this.itemService.getItemByPo(poId)
  .subscribe(items => {
      this.itemListDS.data = items;
         this.enableItemList  = (items.length > 0 ? true : false);
  });

}

onItemRowClicked(row) {

  // this.poFocus.nativeElement.focus();
  // Set the Po Item Detail screen to hidden until the Item is selected on the Item list
    this.enableItemList = true;

  console.log('Row clicked: ', row);

}


onRowClicked(row) {

  // this.poFocus.nativeElement.focus();
  // Set the Po Item Detail screen to hidden until the Item is selected on the Item list
    this.enableItemDetail = false;
    this.enableItemList = true;

  console.log('Row clicked: ', row);
  // this.poFocus.nativeElement.focus();

  this.getItems(row.id);

 // if (this.itemList !== undefined) {
 //   this.itemList.setItemListRowSelected(false);
 // }


  this.selectedPO = row;

  this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
  this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);


  if (this.itemList !== undefined) {
    this.itemList.getItems(row.id);
  }

}

refreshPurchaseOrderListHandler(bidId: string) {
  this.sendData(bidId);
}

refreshItemListHandler(bidId: string) {
  console.log('Called refreshItemListHandler');
}


purchaserChange(event)  {

  const newVal = event.target.value;

  this.poService.getPayCode(newVal)
  .subscribe(cd => {
 // this.selectedPO.payCd = cd[0].agencyPayCode;
//  console.log(cd);
//  console.log(cd[0].agencyTypeId);
//  console.log(cd.agencyTypeId);
});
//  console.log(this.selectedPO.payCd);
 // console.log(this.selectedPO);
}


sendData(bidId: string) {

  this.refreshPoList(bidId);

}

refreshPoList(bidId: string) {

  this.delay(1000).then(any => {
    this.poService.getByBidNumber(bidId).subscribe(po => {
   //   this.purchaseOrders = po;
      this.poDataSource.data = po;

      console.log(this.purchaseOrders.length);

  });
});

}

async delay(ms: number) {
  await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
}



showFilter() {

  if (this.purchaseOrders.length > 0) {
      return true;
  } else {
      return false;
  }

}

  ngAfterViewInit() {
    this.poDataSource.sort = this.sort;
    this.poDataSource.paginator = this.paginator;


  }


  formatDate(dateVal: Date) {
    console.log(dateVal);
  //  dateVal.setHours(2);
    const myDate = this.dateFormatPipe.transform(dateVal);
    console.log(myDate);
    return myDate;

  }


  onSelect(po: PurchaseOrder): void {

    this.poFocus.nativeElement.focus();

    this.enableItemList = true;

    this.enableItemDetail = false;

    this.selectedPO = po;

    this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
    this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);

    if (this.itemList !== undefined) {
      this.itemList.getItems(po.id);
    }

  }

  filterBids(filterVal: string) {
    console.log(filterVal);

    this.refreshPoList(filterVal);

    this.selectedPO = null;

}

  filterSpec(filterVal: string) {
    console.log(filterVal);
}

  ngOnInit() {

/*    this.poService.getBidType()
    .subscribe(_bidType => {
        this.bidTypes = _bidType;
    });  */

    this.poService.getBidNumber()
    .subscribe(_bidNum => {
        this.bidNumbers = _bidNum;
    });

  }

  applyUserFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.poDataSource.filter = filterValue;
  }

}



