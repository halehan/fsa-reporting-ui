import { Component, Input, ViewChild, OnInit, AfterViewInit,  ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource , MatSort} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable} from 'rxjs';
import { PurchaseOrder, Dealer, CityAgency, BidType, Payment, BidNumber,
  VehicleTypeCodes, PoStatusType, Specification, AgencyType } from '../model/index';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { formatNumber } from '../../../node_modules/@angular/common';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})

export class PurchaseOrderListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['bidNumber', 'cityAgency',  'dealerName', 'spec', 'vehicleType',
                      'poNumber', 'poIssueDate', 'edit', 'addPayment'];

  paymentColumns = ['paymentDate', 'paymentAmount', 'paymentNumber', 'paymentCheckNum', 'edit', 'delete'];
  poDataSource = new MatTableDataSource();
  paymentDataSource = new MatTableDataSource();
  purchaseOrders: PurchaseOrder[] = [];
  dealers: Dealer[] = [];
  bidNumbers: BidNumber[] = [];
  poForm: FormGroup;
  types = ['Agency', 'Dealer'];
  cityAgencies: CityAgency[] = [];
  vehicleTypeCodes: VehicleTypeCodes[] = [];
  bidTypes: BidType[] = [];
  myForm: FormControl;
  payment: Payment[] = [];
  showPayment: Boolean = false;
  showNewPayment: Boolean = false;
  bids: String[] = [];
  fuck: Boolean = false;
  specs: Specification[] = [];
  poStatusTypeCodes: PoStatusType[] = [];
  agencyCodes: AgencyType[] = [];

  selectedPO: PurchaseOrder;
  selectedPayment: Payment;
  currentBid: BidNumber;
  newPoForm: FormGroup;
  dateFailed: boolean;

  myDate: Date;

  @ViewChild('poFocus') nameField: ElementRef;
  @ViewChild('paymentFocus') paymentFocus: ElementRef;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() name: string;

  constructor(private poService: PurchaseOrderService, private toastr: ToastrService, private fb: FormBuilder,
              private dateFormatPipe: DateFormatPipe  ) {


    this.myDate = new Date();
}

validateFormDates(g: FormGroup) {

  const poDate: Date = g.get('poIssueDate').value;
  const reporteddate: Date = g.get('dateReported').value;
  const isValid:  boolean = poDate > reporteddate;

 return reporteddate > poDate ? null : {'mismatch': true};


}

editName() {
  this.nameField.nativeElement.focus();
}

refreshPurchaseOrderListHandler(bidId: string) {
  this.sendData(bidId);

}

purchaserChange(event)  {

  const newVal = event.target.value;

  this.poService.getPayCode(newVal)
  .subscribe(cd => {
  this.selectedPO.payCd = cd[0].agencyPayCode;
  console.log(cd);
  console.log(cd[0].agencyTypeId);
  console.log(cd.agencyTypeId);
});
  console.log(this.selectedPO.payCd);
  console.log(this.selectedPO);
}


sendData(bidId: string) {

  this.poService.getByBidNumber(bidId)
    .subscribe(po => {
        this.purchaseOrders = po;
        this.poDataSource.data = po;

    });

}

sleep(milliseconds) {
  const sleep = ( ms ) => {
    const end = +(new Date()) + ms;
    while ( +(new Date()) < end ) { }
   }
}

revert() {
  // Resets to blank object
  this.poForm.reset();

  // Resets to provided model
  this.poForm.reset({ purchaseOrderData: new PurchaseOrder() });
}

onSubmit() {
  // Make sure to create a deep copy of the form-model
  const result: PurchaseOrder = Object.assign({}, this.poForm.value);
  // result.purchaseOrderData = Object.assign({}, result.purchaseOrderData);

  // Do useful stuff with the gathered data
  console.log(result);
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
   // this.paymentDataSource.paginator = this.paymentPaginator;
   // this.paymentDataSource.sort = this.paymentSort;
  }

  onSelectPayment(payment: Payment) {
   this.selectedPayment = payment;
   this.showPayment = true;
   this.fuck = false;

   this.selectedPayment.paymentDate = this.formatDate(this.selectedPayment.paymentDate); 
   this.selectedPayment.lateFeeCheckDate = this.formatDate(this.selectedPayment.lateFeeCheckDate); 
   this.selectedPayment.fsaRefundDate = this.formatDate(this.selectedPayment.fsaRefundDate); 

  }

  formatDate(dateVal: Date) {
    console.log(dateVal);
  //  dateVal.setHours(2);
    const myDate = this.dateFormatPipe.transform(dateVal);
    console.log(myDate);
    return myDate;

  }

  filterVehicleTypes(filterVal: string) {
    console.log(filterVal);
    console.log(this.selectedPO.bidNumber);
    console.log(this.selectedPO.spec);

    this.poService.getVehicleType(this.selectedPO.bidNumber, filterVal)
    .subscribe(data => {
        this.vehicleTypeCodes = data;
    });

}

  filterSpecifications(filterVal: string) {

    // reset the VehicleTypes
    this.vehicleTypeCodes = null;

    this.poService.getSpec(filterVal)
    .subscribe(data => {
        this.specs = data;
    });

  }

  onSelect(po: PurchaseOrder): void {

    this.poService.getPoById(po.id)
    .subscribe(poVal => {
        this.selectedPO = poVal[0];
        this.selectedPO.poIssueDate = this.formatDate(this.selectedPO.poIssueDate);
        this.selectedPO.dateReported = this.formatDate(this.selectedPO.dateReported);
        this.selectedPO.estimatedDelivery =  this.formatDate(this.selectedPO.estimatedDelivery);
        console.log('this.selectedPo.actualPo' +  this.selectedPO.actualPo);
        console.log('this.selectedPo.poAmount' + this.selectedPO.poAmount);
        console.log('this.selectedPo.correction' + this.selectedPO.correction);
    });


   // this.selectedPO = po;
    this.selectedPayment = null;
    this.showPayment = true;
    this.showNewPayment = false;
    this.fuck = false;

    this.poService.getPayment(po.id)
    .subscribe(payment => {
        this.payment = payment;
        this.paymentDataSource.data = payment;

    });

    this.poService.getVehicleType(po.bidNumber, po.spec)
    .subscribe(vehicleTypeCodes => {
        this.vehicleTypeCodes = vehicleTypeCodes;
    });

    this.poService.getBids()
    .subscribe(bids => {
        this.bids = bids;
        this.bidNumbers = bids;
    });

   this.nameField.nativeElement.focus();
  }

  filterBids(filterVal: string) {
    console.log(filterVal);

    this.poService.getAdminFee(filterVal)
    .subscribe(bid => {
        this.currentBid = bid[0];
    });


    this.poService.getByBidNumber(filterVal)
    .subscribe(po => {
        this.purchaseOrders = po;
        this.poDataSource.data = po;

    });

    this.selectedPO = null;

}

  filterSpec(filterVal: string) {
    console.log(filterVal);
}

  ngOnInit() {

    this.poService.getPostatusType()
    .subscribe(codes => {
      this.poStatusTypeCodes = codes;
  });

    this.poService.getDealer()
    .subscribe(_dealers => {
        this.dealers = _dealers;
    });

    this.poService.getCityAgency()
    .subscribe(_cityAgency => {
        this.cityAgencies = _cityAgency;
    });

    this.poService.getBidType()
    .subscribe(_bidType => {
        this.bidTypes = _bidType;
    });

    this.poService.getBidNumber()
    .subscribe(_bidNum => {
        this.bidNumbers = _bidNum;
    });

  //  console.log(this.bidNumbers);
  //  console.log(this.bidTypes);


  }


  applyUserFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.poDataSource.filter = filterValue;
  }

  cancelPayment() {  this.selectedPayment = null;
  }

  showNewPurchaseOrder() {
    this.showNewPayment = true;
    this.showPayment = false;
  }


  newPayment(po: PurchaseOrder) {
    this.onSelect(po);
    this.selectedPayment = new Payment();
    this.selectedPayment.fsaReportId = po.id;
    this.showPayment = true;
    this.fuck = true;

    this.paymentFocus.nativeElement.focus();

  }

  newPayment2() {
    this.selectedPayment = new Payment();
    this.selectedPayment.fsaReportId = this.selectedPO.id;
    this.showPayment = true;
    this.fuck = true;

    this.sleep(1000);
    this.paymentFocus.nativeElement.focus();
  }

  calculateAdminFee(poAmount: number) {
    return this.truncateDecimals(poAmount * this.currentBid.AdminFeeRate, 2);

  }

  truncateDecimals(poAmount: number, places: number) {
    const shift = Math.pow(10, places);

    return ((poAmount * shift) | 0) / shift;
};


  updatePurchaseOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let adminCalc: number;

    if  ( Number(this.selectedPO.actualPo) > 0 ) {
      adminCalc = this.calculateAdminFee(Number(this.selectedPO.actualPo));
    } else if (Number(this.selectedPO.poAmount) > 0 )   {
      adminCalc = this.calculateAdminFee(Number(this.selectedPO.poAmount));
    }
    this.selectedPO.adminFeeDue = adminCalc;

    this.selectedPO.updatedBy = currentUser.username;

    if (this.selectedPO.dealerFlag){
      this.selectedPO.dealerFlag = 'X';
    } else {
      this.selectedPO.dealerFlag = '';
    }

    if (this.selectedPO.agencyFlag){
      this.selectedPO.agencyFlag = 'X';
    } else {
      this.selectedPO.agencyFlag = '';
    }

    console.log(this.selectedPO.dealerFlag);
    console.log(this.selectedPO.agencyFlag);
   
    this.poService.updatePurchaseOrder(this.selectedPO).subscribe(po => {
  //  this.selectedPO = po;
   // this.myForm.reset();
  });

    this.toastr.success('PO Saved Successful', 'PO Update', {
    timeOut: 2000,
});

     this.sendData(this.selectedPO.bidNumber);

  }

  insertPayment () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.selectedPayment.updatedBy = currentUser.username;
    this.poService.createPayment(this.selectedPayment).subscribe(payment => {
    this.selectedPayment = payment;
    this.selectedPayment = null;
  });

    this.toastr.success('Payment Insert Successful', 'Payment Insert', {
    timeOut: 2000,
});

this.poService.getPayment(this.selectedPO.id)
    .subscribe(payment => {
        this.payment = payment;
        this.paymentDataSource.data = payment;

    });


  }

  updatePayment() {
      this.poService.updatePayment(this.selectedPayment).subscribe(po => {
      this.selectedPayment = null;
  });

  this.toastr.success('Payment Saved Successful', 'Payment Update', {
    timeOut: 2000,
  });

}

}
