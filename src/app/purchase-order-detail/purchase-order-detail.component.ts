
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Output, EventEmitter, Input  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PurchaseOrder } from '../model/index';
import { Dealer, CityAgency, BidType, BidNumber, PoStatusType, Specification } from '../model/index';
import { ContactRequest } from '../model/contact-request';
import { PersonalData } from '../model/contact-request';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ItemService } from '../services/item.service';
import { ToastrService } from 'ngx-toastr';
import { ItemBidTypeCode } from '../model/itemBidTypeCode';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import * as moment from 'moment';


@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit, AfterViewInit {

  @Output() refreshPurchaseOrderList: EventEmitter<string> =   new EventEmitter();
  @ViewChild('poFocus') poFocus: ElementRef;
  @Input() pox: PurchaseOrder;
  @Input() isNew: Boolean;
  @Input() bidId: string;
  @Input() poId: number;
  @Input() enableItemDetail: boolean;
  @Input() enablePoDetail: boolean;
  @ViewChild(ItemDetailComponent) itemDetail: ItemDetailComponent;
  @ViewChild(ItemListComponent) itemList: ItemListComponent;

  contactForm: FormGroup;
  cityAgencies: CityAgency[] = [];
  bidTypes: BidType[] = [];
  bidNumbers: BidNumber[] = [];

  dealers: Dealer[] = [];
  newPO: PurchaseOrder;
  currentPO: PurchaseOrder;

  enableSpec: Boolean = false;
  enableVehicleType: String = 'disabled';
  specs: Specification[] = [];
  itemTypeCodes: ItemBidTypeCode[] = [];
  savedBid: string;
  poStatusTypeCodes: PoStatusType[] = [];
  // newPoForm: FormGroup;
  poForm: FormGroup;

  datePoIssueValid: boolean;
  datePoIssueBidValid: boolean;

  datePoReportedBidValid: boolean;
  datePoReportedValid: boolean;

  poIssueDateErrorMsg: string;
  poReportedDateErrorMsg: string;

  currentBid: BidNumber;
  messagePoIssueDate: string;
  messagePoReportedDate: string;
  messagePoAmount: string;

  messagePoFinal: string;
  poFinalValid: boolean;
  poNew: boolean;
  poAmountValid: boolean;
  vendorDebugRowCount: string;

  constructor(private poService: PurchaseOrderService, private itemService: ItemService, private toastr: ToastrService,
    private fb: FormBuilder, private dateFormatPipe: DateFormatPipe) { }

    focusPoDetail () {

      this.delay(100).then(any => {
        this.poFocus.nativeElement.focus();
    });

    }

    async delay(ms: number) {
      await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
    }

   ngAfterViewInit() {
     console.log('Values on ngAfterViewInit():');
     console.log('itemList:', this.itemList);
     console.log('poId', this.poId); 

     this.formControlValueChanged();

   }

newItem() {

  this.itemList.chain();

}

ngOnInit() {
  this.poNew = false;

  this.getPurchaseOrder(this.poId);

  this.poService.getPostatusType()
  .subscribe(codes => {
    this.poStatusTypeCodes = codes;
});

this.poService.getDealerAssoc(this.bidId)
        .subscribe(_dealers => {
            this.dealers = _dealers;
            this.vendorDebugRowCount = _dealers.length;
        });

/*
this.poService.getDealer()
.subscribe(_dealers => {
     this.dealers = _dealers;
     this.vendorDebugRowCount = _dealers.length;
});
*/

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

  this.poForm = this.createFormGroup();

}

truncateDecimals(poAmount: number, places: number) {
 // const shift = Math.pow(10, places);
 // const suck = poAmount.toFixed(places);
 // return ((poAmount * shift) | 0) / shift;
 return Number(poAmount.toFixed(places));
};

calculateAdminFee(poAmount: number) {
 return this.truncateDecimals(poAmount * parseFloat(this.currentBid.AdminFeeRate), 2);
// return this.truncateDecimals(poAmount * .07, 2);

}

newPo() {
  this.newPO = new PurchaseOrder();
  this.poForm = this.createFormGroup();

  this.datePoIssueValid = true;
  this.datePoIssueBidValid = true;

  this.datePoReportedBidValid = true;
  this.datePoReportedValid = true;
  this.poFinalValid = true;
  this.poAmountValid = true;
  this.poNew = true;

  this.messagePoFinal = '';

  this.formControlValueChanged();

  this.poService.getAdminFee(this.bidId).subscribe(bid => {this.currentBid = bid[0];
    console.log(this.currentBid.AdminFeeRate);
    this.poForm.controls['bidType'].patchValue(this.currentBid.BidType, {emitEvent : false});
    });


  this.poService.getDealerAssoc(this.bidId)
        .subscribe(_dealers => {
            this.dealers = _dealers;
            this.vendorDebugRowCount = _dealers.length;
        });

        this.poForm.controls['bidNumber'].patchValue(this.bidId, {emitEvent : false});
}


formControlValueChanged() {

 this.poForm.get('poIssueDate').valueChanges.subscribe(
    _issueDate => {

      const startDate    = moment(this.currentBid.StartDate, 'YYYY-MM-DD');
      const endDate      = moment(this.currentBid.EndDate, 'YYYY-MM-DD');
      const poIssueDate  = moment(_issueDate, 'YYYY-MM-DD');
      const dateReported = moment(this.poForm.controls.dateReported.value, 'MM/DD/YYYY');
      const todaysDate   = moment();

      const poIssueDateValid: boolean =
           poIssueDate.isBetween(startDate, endDate);

      let poIssueDateAfterValid: boolean;
      poIssueDateAfterValid = true;
      let isSame: boolean;
      let isAfter: boolean;

      if (!(this.poForm.controls.dateReported.value == null)) {
        poIssueDateAfterValid = poIssueDate.isBefore(dateReported);
        isSame = poIssueDate.isSame(dateReported);
        isAfter = poIssueDate.isAfter(todaysDate);
      }

       console.log('po Issue Date Valid? ', poIssueDateValid);
       console.log('po Issue Date > Reported Date? ', poIssueDateAfterValid);

      this.poForm.controls['poIssueDate'].patchValue(_issueDate, {emitEvent : false});


        if ((poIssueDateAfterValid || isSame ) && poIssueDateValid) {
            this.datePoIssueValid = true;
            this.datePoIssueBidValid = true;
            this.poForm.controls['poIssueDate'].setErrors(null, {emitEvent : false});
            this.messagePoIssueDate = '';
         } else if (isAfter) {
            this.datePoIssueValid = false;
            this.poForm.controls['dateReported'].setErrors(_issueDate, {emitEvent : false});
            this.messagePoIssueDate = 'PO Issue Date can not be after today ';
        } else if (!(poIssueDateAfterValid || isSame) ) {
            this.datePoIssueValid = false;
            this.poForm.controls['poIssueDate'].setErrors(_issueDate, {emitEvent : false});
            this.messagePoIssueDate = 'PO Issue Date must be before Reported Date ';
        } else {
          this.datePoIssueBidValid = false;
          this.poForm.controls['poIssueDate'].setErrors(_issueDate, {emitEvent : false});
          this.messagePoIssueDate = 'PO Issue Date is not within the date range for the respective bid ';
      }

      return poIssueDateValid && poIssueDateAfterValid ? null : {mismatch: true};
    });

  this.poForm.get('dateReported').valueChanges.subscribe(
      _dateReported => {

      //  const startDate      = moment(this.currentBid.StartDate, 'YYYY-MM-DD');
      //  const endDate        = moment(this.currentBid.EndDate, 'YYYY-MM-DD');
        const poDateReported = moment(_dateReported, 'YYYY-MM-DD');
        const poIssueDate    = moment(this.poForm.controls.poIssueDate.value, 'MM/DD/YYYY');
        const todaysDate = moment();

    //    const poDateReportedDateBidValid: boolean =
    //      poDateReported.isBetween(startDate, endDate);

        let poDateReportedDateAfterValid: boolean;
        poDateReportedDateAfterValid = true;
        let isSame: boolean;
        let isAfter: boolean;

        if (!(this.poForm.controls.poIssueDate.value == null)) {
          poDateReportedDateAfterValid = poIssueDate.isBefore(poDateReported) &&
          !(poDateReported.isAfter(todaysDate));
          isSame  = poIssueDate.isSame(poDateReported);
          isAfter = poDateReported.isAfter(todaysDate);
        }

     //   console.log('po Issue Date Valid? ', poDateReportedDateBidValid);

        this.poForm.controls['dateReported'].patchValue(_dateReported, {emitEvent : false});

        if (poDateReportedDateAfterValid || isSame) {
          this.datePoReportedValid = true;
      //    this.datePoReportedBidValid = true;
          this.poForm.controls['dateReported'].setErrors(null, {emitEvent : false});
          this.messagePoReportedDate = '';
          }  else if (isAfter) {
          this.datePoReportedValid = false;
          this.poForm.controls['dateReported'].setErrors(_dateReported, {emitEvent : false});
          this.messagePoReportedDate = 'PO Reported Date can not be after today ';
      } else  {
          this.datePoReportedValid = false;
          this.poForm.controls['dateReported'].setErrors(_dateReported, {emitEvent : false});
          this.messagePoReportedDate = 'PO Reported Date must be after PO Issue Date ';
      }


        return  poDateReportedDateAfterValid ? null : {mismatch: true};
      });

  this.poForm.get('bidNumber').valueChanges.subscribe(
    _bidNumber => {

     // Need to get list of dealers that are in the DealerBidAssoc
     this.poService.getDealerAssoc(_bidNumber)
     .subscribe(_dealers => {
         this.dealers = _dealers;
         this.vendorDebugRowCount = _dealers.length;
     });

       this.poService.getAdminFee(_bidNumber).subscribe(bid => {this.currentBid = bid[0];
       console.log(this.currentBid.AdminFeeRate);
       this.poForm.controls['bidType'].patchValue(this.currentBid.BidType, {emitEvent : false});
       });

     const startDate   = moment(this.currentBid.StartDate, 'YYYY-MM-DD');
     const endDate     = moment(this.currentBid.EndDate, 'YYYY-MM-DD');

     console.log('Start Date', startDate);
     console.log('Start Date', endDate);

    });


  this.poForm.get('poFinal').valueChanges.subscribe(
    _poFinal => {
      console.log('poFinal changed ' + _poFinal);
      if ( _poFinal) {
        const poAmount: number = Number(this.poForm.controls.poAmount.value);

        this.itemService.getItemAmountByPoId(this.poId).subscribe(_amt => {
          const itemSum: number = Number(_amt[0].amt);
          if (!(poAmount === itemSum)) {
            this.messagePoFinal = 'PO and Item amounts do not match';
            this.poFinalValid = false;
            this.poForm.setErrors({ 'invalid': true });
          } else {
            this.messagePoFinal = '';
            this.poFinalValid = true;
          //  this.poForm.setErrors({ invalid: true });
          }
         console.log('Item Amount = ', _amt[0].amt);
         });

     console.log('Kick off Po Final validation');

     console.log('poAmount ', poAmount );
      } else {
        this.messagePoFinal = '';
        this.poFinalValid = true;
      }
      return this.poFinalValid ? null : {mismatch: true};

    });

  this.poForm.get('poAmount').valueChanges.subscribe(
    _poAmount => {
 //     if ( _poAmount > 0) {
      console.log(this.calculateAdminFee(_poAmount));
      this.poForm.patchValue({'adminFeeDue': this.calculateAdminFee(_poAmount)});
 //      this.messagePoAmount = '';
 //      this.poAmountValid = true;
 //    } else {
 //      this.messagePoAmount = 'PO Amount must be > 0';
 //      this.poAmountValid = false;
 //      this.poForm.controls['poAmount'].setErrors(_poAmount, {emitEvent : false});
 //     }
    });

   this.poForm.get('cityAgency').valueChanges.subscribe(
        _cityAgency => {
          this.poService.getPayCode(_cityAgency).subscribe(cd => {
            this.poForm.controls['payCd'].patchValue(cd[0].agencyPayCode, {emitEvent : false});
          });
      });


}

getSuck() {
  return this.enableVehicleType;
}

formatDate(dateVal: Date) {
  console.log(dateVal);
  const myDate = this.dateFormatPipe.transform(dateVal);
  console.log(myDate);

  moment.locale();         // en
  moment().format('LT');
  const a = moment(dateVal.toLocaleString());
  const b = a.add(8, 'hour');
  const myDate2 = this.dateFormatPipe.transform(b);

  return myDate2;

}

/*
formatDate(dateVal: Date) {
  console.log(dateVal);
//  dateVal.setHours(2);
  const myDate = this.dateFormatPipe.transform(dateVal);
  console.log(myDate);
  return myDate;

}
*/
copyModelToForm() {

  if (this.currentPO != null) {

    this.poService.getDealerAssoc(this.currentPO.bidNumber)
     .subscribe(_dealers => {
         this.dealers = _dealers;
         this.vendorDebugRowCount = _dealers.length;
     });

    this.datePoIssueValid = true;
    this.datePoIssueBidValid = true;

    this.datePoReportedBidValid = true;
    this.datePoReportedValid = true;
    this.poFinalValid = true;
    this.poAmountValid = true;

    this.messagePoFinal = '';
          this.poFinalValid = true;

    this.poService.getAdminFee(this.currentPO.bidNumber).subscribe(bid => {this.currentBid = bid[0]; });

    const fname: string = this.currentPO.dealerName;
    console.log(fname);

    this.poForm.controls['bidNumber'].patchValue(this.currentPO.bidNumber, {emitEvent : false});
    this.poForm.controls['poNumber'].patchValue(this.currentPO.poNumber, {emitEvent : false});
  //  this.poForm.controls['poIssueDate'].patchValue(this.currentPO.poIssueDate, {emitEvent : false});
  //  this.poForm.controls['dateReported'].patchValue(this.currentPO.dateReported, {emitEvent : false});
    this.poForm.controls['poIssueDate'].patchValue(this.formatDate(this.currentPO.poIssueDate), {emitEvent : false});
    this.poForm.controls['dateReported'].patchValue(this.formatDate(this.currentPO.dateReported), {emitEvent : false});
    this.poForm.controls['estimatedDelivery'].patchValue(this.currentPO.estimatedDelivery, {emitEvent : false});
    this.poForm.controls['cityAgency'].patchValue(this.currentPO.cityAgency, {emitEvent : false});
    this.poForm.controls['dealerName'].patchValue(this.currentPO.dealerName, {emitEvent : false});
 //   this.poForm.controls['spec'].patchValue(this.currentPO.spec, {emitEvent : false});
 //   this.poForm.controls['vehicleType'].patchValue(this.currentPO.vehicleType, {emitEvent : false});
    this.poForm.controls['agencyFlag'].patchValue(this.currentPO.agencyFlag, {emitEvent : false});
    this.poForm.controls['dealerFlag'].patchValue(this.currentPO.dealerFlag, {emitEvent : false});
    this.poForm.controls['poStatus'].patchValue(this.currentPO.poStatus, {emitEvent : false});
    this.poForm.controls['poFinal'].patchValue(this.currentPO.poFinal, {emitEvent : false});

    this.poForm.controls['qty'].patchValue(this.currentPO.qty, {emitEvent : false});
    this.poForm.controls['poAmount'].patchValue(this.currentPO.poAmount, {emitEvent : false});
    this.poForm.controls['actualPo'].patchValue(this.currentPO.actualPo, {emitEvent : false});

    this.poForm.controls['adminFeeDue'].patchValue(this.currentPO.adminFeeDue, {emitEvent : false});
    this.poForm.controls['comments'].patchValue(this.currentPO.comments, {emitEvent : false});
    this.poForm.controls['payCd'].patchValue(this.currentPO.payCd, {emitEvent : false});
//    this.poService.getItem(this.currentPO.bidNumber).subscribe(data => {this.specs = data; });
     }

  }


createFormGroup() {

  return new FormGroup({

      bidNumber:  new FormControl('', Validators.required),
      poNumber: new FormControl('', Validators.required),
      poIssueDate: new FormControl(),
      dateReported: new FormControl(),
      estimatedDelivery: new FormControl(),
      cityAgency: new FormControl('', Validators.required),
      dealerName: new FormControl('', Validators.required),
  //    spec: new FormControl('', Validators.required),
  //    vehicleType: new FormControl('', Validators.required),
      agencyFlag: new FormControl(),
      bidType: new FormControl(),
      dealerFlag: new FormControl(),
      poStatus: new FormControl('No'),
      poFinal: new FormControl(),
      qty: new FormControl(),
      poAmount: new FormControl(),
    //  poAmount: new FormControl('', Validators.required),
      actualPo: new FormControl(),
      adminFeeDue: new FormControl({disabled: true}),
      comments: new FormControl(),
      payCd: new FormControl()
    }, );
}

copyFormToNewModel() {

  this.newPO.bidNumber = this.poForm.controls.bidNumber.value;
  this.newPO.bidType = this.poForm.controls.bidType.value;
  this.newPO.poNumber = this.poForm.controls.poNumber.value;
  this.newPO.poIssueDate = this.poForm.controls.poIssueDate.value;
  this.newPO.dateReported = this.poForm.controls.dateReported.value;
  this.newPO.estimatedDelivery = this.poForm.controls.estimatedDelivery.value;
  this.newPO.cityAgency = this.poForm.controls.cityAgency.value;
  this.newPO.dealerName = this.poForm.controls.dealerName.value;
  // this.newPO.spec = this.poForm.controls.spec.value;
  // this.newPO.vehicleType  = this.poForm.controls.vehicleType.value;
  this.newPO.agencyFlag  = this.poForm.controls.agencyFlag.value;
  this.newPO.dealerFlag = this.poForm.controls.dealerFlag.value;
  this.newPO.poStatus = this.poForm.controls.poStatus.value;
  this.newPO.poAmount = this.poForm.controls.poAmount.value;
 // this.newPO.actualPo = this.poForm.controls.actualPo.value;
  this.newPO.adminFeeDue = this.poForm.controls.adminFeeDue.value;
  this.newPO.comments = this.poForm.controls.comments.value;
  this.newPO.payCd = this.poForm.controls.payCd.value;

}

copyFormToModel() {

  this.currentPO.bidNumber = this.poForm.controls.bidNumber.value;
  this.currentPO.bidType = this.poForm.controls.bidType.value;
  this.currentPO.poNumber = this.poForm.controls.poNumber.value;
  this.currentPO.poIssueDate = this.formatDate(this.poForm.controls.poIssueDate.value);
  this.currentPO.dateReported = this.formatDate(this.poForm.controls.dateReported.value);
 // this.currentPO.estimatedDelivery = this.formatDate(this.poForm.controls.estimatedDelivery.value);
  this.currentPO.cityAgency = this.poForm.controls.cityAgency.value;
  this.currentPO.dealerName = this.poForm.controls.dealerName.value;
  // this.currentPO.spec = this.poForm.controls.spec.value;
  // this.currentPO.vehicleType  = this.poForm.controls.vehicleType.value;
  this.currentPO.agencyFlag  = this.poForm.controls.agencyFlag.value;
  this.currentPO.dealerFlag = this.poForm.controls.dealerFlag.value;
  this.currentPO.poStatus = this.poForm.controls.poStatus.value;
  this.currentPO.poAmount = this.poForm.controls.poAmount.value;
 // this.currentPO.actualPo = this.poForm.controls.actualPo.value;
  this.currentPO.adminFeeDue = this.poForm.controls.adminFeeDue.value;
  this.currentPO.comments = this.poForm.controls.comments.value;
  this.currentPO.payCd = this.poForm.controls.payCd.value;
  this.currentPO.poFinal =  this.poForm.controls.poFinal.value;


}

/*
validateFormDates(g: FormGroup) {

  const poDate: Date =  g.get('poIssueDate').value;
  const reporteddate: Date =  g.get('dateReported').value;

  if (!g.get('dateReported').pristine) {
    console.log(reporteddate);
  }

  if (!g.get('poIssueDate').pristine) {
    console.log(poDate);

  }

 // const isDateRangeValid:  boolean = poIssueDateValid && poReportedDateValid;

  const isValid:  boolean = reporteddate >= poDate;

 return isValid  ? null : {mismatch: true};

}

*/

revert() {
  // Resets to blank object
  this.contactForm.reset();

  // Resets to provided model
  this.contactForm.reset({ personalData: new PersonalData(), requestType: '', text: '' });
}


  getCurrentUserName() {
    return JSON.parse(localStorage.getItem('currentUser')).username;
  }

  refreshItemListHandler(bidId: string) {
    console.log('Called refreshItemListHandler');

  }

  insertPo() {

    this.newPO.createdBy = this.getCurrentUserName();
    this.newPO.updatedBy = this.getCurrentUserName();

    this.isNew = false;
    //this.enableItemList = true;

    this.poService.createPurchaseOrder(this.newPO).subscribe(po => {
    });

    this.refreshPurchaseOrderList.emit(this.newPO.bidNumber);

     this.toastr.success('Purchase Order Insert Successful', 'Purchase Insert', {
      timeOut: 2000,
      });

      this._markFormPristine(this.poForm);

      //HACK
      this.datePoIssueValid = true;
      this.datePoIssueBidValid = true;
      this.datePoReportedValid = true;
      this.datePoReportedBidValid = true;
      this.poAmountValid = true;


  }

  private _markFormPristine(form: FormGroup ): void {
    Object.keys(form.controls).forEach(control => {
        form.controls[control].markAsPristine();
    });
}

  updatePo() {

    this.currentPO.updatedBy = this.getCurrentUserName();

    this.poService.updatePurchaseOrder(this.currentPO).subscribe(po => {
    });


   this.refreshPurchaseOrderList.emit(this.currentPO.bidNumber);

     this.toastr.success('Purchase Order Save Successful', 'Purchase Update', {
      timeOut: 2000,
      });

      console.log(this.poForm.pristine.valueOf());

      this._markFormPristine(this.poForm);

      console.log(this.poForm.pristine.valueOf());

      //HACK
      this.datePoIssueValid = true;
      this.datePoIssueBidValid = true;
      this.datePoReportedValid = true;
      this.datePoReportedBidValid = true;
      this.poAmountValid = true;

  }

  processPurchaseOrder() {

    // Determine if the action is an update or insert of the PO.

     if (this.poForm.invalid) {
       this.datePoIssueValid = true;
       return;
     } else {
        this.datePoIssueValid = false;


    if (this.isNew) {
      this.copyFormToNewModel();
      this.insertPo();
    } else {
      this.copyFormToModel();
      this.updatePo();
    }


  }

}

getPurchaseOrder2() {

        this.currentPO = this.pox;
        this.copyModelToForm();

}



getPurchaseOrder(id: number) {

  this.poService.getPoById(id)
    .subscribe(po => {
        this.currentPO = po[0];
    //    console.log(this.currentPO.id);
        this.copyModelToForm();
    });
/* if ( this.currentPO !== undefined ) {
    this.poService.getDealerAssoc(this.currentPO.bidNumber)
        .subscribe(_dealers => {
             this.dealers = _dealers;
  });
} */

}



}
