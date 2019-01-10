
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
import { PaymentDetailComponent } from '../payment-detail/payment-detail.component';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})

export class PaymentListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['bidNumber', 'cityAgency',  'dealerName', 'poNumber', 'poStatus',
                      'poIssueDate', 'dateReported', 'poAmount', 'adminFeeDue'];

  itemColumns =    ['itemNumber', 'itemDescription',  'itemType', 'itemMake', 'itemModel', 'qty',
                    'itemAmount', 'adminFeeDue', 'paymentAmount', 'balance'];

  paymentColumns = ['paymentNumber', 'paymentCheckNum',  'fsaAlloc', 'facAlloc', 'ffcaAlloc', 'totalAlloc', 'paymentAmount', 'paymentDate'];

  poDataSource = new MatTableDataSource();
  itemListDS = new MatTableDataSource();
  paymentListDS = new MatTableDataSource();
  purchaseOrders: PurchaseOrder[] = [];

  bidNumbers: BidNumber[] = [];
  bidTypes: BidType[] = [];
  bids: String[] = [];
  payCd: string;
  adminFee: number;
  paymentId: number;
  paymentNumber: number;  // just send the rowcount of paymentListDS
  poId: number;
  itemId: number;
  itemNumber: number;
  itemType: string;
  adminFeeRate: number;
  poStatus: string;
  poSearchVal: string;

  selectedPO: PurchaseOrder;

  currentBid: BidNumber;

  bidId: string;
  bidType: string;
  enableItemDetail: boolean;
  enableItemList: boolean;
  enablePaymentList: boolean;
  enablePaymentDetail: boolean;
  enableNewPayment: boolean;
  enableSearch: boolean;
  selectedRowIndex: number;
  selectedRowIndexItems: number;
  selectedRowIndexPayment: number;

  @ViewChild('poFocus') poFocus: ElementRef;
  @ViewChild('paymentFocus') paymentFocus: ElementRef;

  @ViewChild(ItemPaymentComponent) item: ItemPaymentComponent;
  @ViewChild(ItemListComponent) itemList: ItemListComponent;
  @ViewChild(PaymentDetailComponent) paymentDetail: PaymentDetailComponent;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) itemPaginator: MatPaginator;

  constructor(private poService: PurchaseOrderService,  private itemService: ItemService,
              private dateFormatPipe: DateFormatPipe ) {

                this.enableItemDetail = false;
                this.enablePaymentDetail = false;
                this.enableNewPayment = false;
                this.poStatus = 'All';
}

resetControls() {

  this.enableItemList = false;
  this.enableItemDetail = false
  this.enableItemList = false;
  this.enablePaymentList = false;
  this.enablePaymentDetail = false;
  this.enableNewPayment = false;

}

search() {

  this.selectedRowIndex = -1;
  this.selectedRowIndexItems = -1;
  this.selectedRowIndexPayment = -1;

  this.resetControls();



  console.log(this.bidId);
  console.log(this.poStatus);

  this.enableSearch = false;
 // this.poSearchVal = '';

 if (!(this.isEmpty(this.poSearchVal)) ) {
    console.log('poSearch valid ', this.poSearchVal);

    this.delay(1000).then(any => {
      this.poService.searchPaymentByPo(this.poSearchVal).subscribe(po => {
        this.poDataSource.data = po;

        console.log(this.purchaseOrders.length);
    });
  });

 } else {
  this.refreshPoList(this.bidId, this.poStatus);
 }

}

isEmpty(str: string) {
  return (!str || 0 === str.length);
}

newPayment() {

  this.paymentDetail.newItemPayment();

  this.enablePaymentDetail = true;

}

getItems(poId: number) {

  this.enableItemDetail = false;

  this.itemService.getItemByPo(poId)
  .subscribe(items => {
      this.itemListDS.data = items;
         this.enableItemList  = (items.length > 0 ? true : false);
  });

}

onPaymentRowClicked(row) {

  this.selectedRowIndexPayment = row.id;

  console.log('Row clicked: ', row);
  this.paymentId = row.id;
  this.poId = row.fsaCppPurchaseOrderId;
  this.enablePaymentDetail  = true;

  this.paymentDetail.copyModelToForm(row);

  this.paymentDetail.focusPayment();

}

refreshPaymentListHandler(itemId: number) {
  this.delay(1000).then(any => {
    this.itemService.getPaymentByItemId(itemId)
  .subscribe(items => {
      this.paymentListDS.data = items;
       this.enablePaymentList  = (items.length > 0 ? true : false);
       this.paymentNumber = items.length;
  });
});
}

onItemRowClicked(row) {

  this.selectedRowIndexItems = row.id;

  // this.poFocus.nativeElement.focus();
  // Set the Po Item Detail screen to hidden until the Item is selected on the Item list
 //   this.enableItemList = true;

  console.log('Row clicked: ', row);
  this.itemId = row.id;
  this.itemNumber = row.itemNumber;
  this.itemType = row.itemType;
  this.poId = row.fsaCppPurchaseOrderId;
  this.enablePaymentDetail = false;

  // Retrieve the payments for this row
  this.itemService.getPaymentByItemId(row.id)
  .subscribe(items => {
        this.paymentListDS.data = items;
       this.enablePaymentList  = (items.length > 0 ? true : false);
       this.paymentNumber = items.length;
       this.enableNewPayment = true;
  });

  this.paymentDetail.initFees();
}

onRowClicked(row) {

  this.selectedPO = row;
  this.selectedRowIndex = row.id;
  this.payCd = row.payCd;
  this.bidType = row.bidType;
  this.enableNewPayment = false;

  this.poService.getAdminFee(row.bidNumber)
  .subscribe(bid => {
    this.adminFeeRate = bid[0].AdminFeeRate;
  });

  // this.poFocus.nativeElement.focus();
  // Set the Po Item Detail screen to hidden until the Item is selected on the Item list
    this.enableItemDetail = false;
  //  this.enableItemList = false;
    this.enablePaymentDetail = false;
    this.enablePaymentList = false;

  console.log('Row clicked: ', row);
  // this.poFocus.nativeElement.focus();

  this.getItems(row.id);

 // if (this.itemList !== undefined) {
 //   this.itemList.setItemListRowSelected(false);
 // }

 // this.adminFee = row.

  this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
  this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);


  if (this.itemList !== undefined) {
    this.itemList.getItems(row.id);
  }

}

refreshPurchaseOrderListHandler(bidId: string, status: string) {
  this.sendData(bidId, status);
}

refreshItemListHandler(bidId: string) {
  console.log('Called refreshItemListHandler');
}

valueChange(event)  {
  const newVal = event.target.value;
  console.log(newVal);
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


sendData(bidId: string, status: string) {

 this.refreshPoList(bidId, status);

}

refreshPoList(bidId: string, status: string) {

  this.delay(1000).then(any => {
    this.poService.searchPayment(bidId, status).subscribe(po => {
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

  if (this.poDataSource.data.length > 0) {
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
    console.log(dateVal.toLocaleString());
  //  dateVal.setHours(2);
    const myDate = this.dateFormatPipe.transform(dateVal);
    console.log(myDate);

    moment.locale();         // en
    moment().format('LT');
    const a = moment(dateVal.toLocaleString());
    const b = a.add(8, 'hour');
    const myDate2 = this.dateFormatPipe.transform(b);

    return myDate2;

  }


  onSelect(po: PurchaseOrder): void {

    this.itemListDS.paginator = this.itemPaginator;

    this.poFocus.nativeElement.focus();

    this.enableItemList = true;

    this.enableItemDetail = false;

    this.selectedPO = po;

    this.poId = po.id;

    this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
    this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);

    if (this.itemList !== undefined) {
      this.itemList.getItems(po.id);
    }

  }

  statusClicked(val: string) {

    this.enableSearch = true;
    this.poStatus = val;
    console.log('Val = ' + val);

  }

  poValueChanged(val: string) {

    this.enableSearch = true;
    this.poSearchVal = val;
    console.log('Val = ' + val);

  }

  unPaidClicked(val: boolean) {
    this.enableSearch = true;

    console.log('Unpaid = ' + val);

  }

  filterBids(filterVal: string) {
    this.bidId = filterVal;
    this.enableSearch = true;


 //   this.refreshPoList(filterVal);

    this.selectedPO = null;


}

  filterSpec(filterVal: string) {
    console.log(filterVal);
}

  ngOnInit() {

    this.selectedRowIndex = -1;
    this.selectedRowIndexItems = -1;
    this.selectedRowIndexPayment = -1;

    this.poDataSource.paginator = this.paginator;


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
