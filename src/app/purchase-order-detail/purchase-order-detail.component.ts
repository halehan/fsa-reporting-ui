
import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Output, EventEmitter, Input  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PurchaseOrder } from '../model/index';
import { Dealer, CityAgency, BidType, BidNumber, PoStatusType, Specification } from '../model/index';
import { ContactRequest } from '../model/contact-request';
import { PersonalData } from '../model/contact-request';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { ItemBidTypeCode } from '../model/itemBidTypeCode';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import { ItemListComponent } from '../item-list/item-list.component';
import { ItemDetailComponent } from '../item-detail/item-detail.component';


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
  dateFailed: boolean;
  currentBid: BidNumber;

  constructor(private poService: PurchaseOrderService, private toastr: ToastrService, private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe) { }

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
}

newItem() {

  this.itemList.chain();

}

ngOnInit() {

  this.poForm = this.createFormGroup();

  this.getPurchaseOrder(this.poId);

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

this.formControlValueChanged();

}

truncateDecimals(poAmount: number, places: number) {
  const shift = Math.pow(10, places);

  return ((poAmount * shift) | 0) / shift;
};

calculateAdminFee(poAmount: number) {
 return this.truncateDecimals(poAmount * parseFloat(this.currentBid.AdminFeeRate), 2);
// return this.truncateDecimals(poAmount * .07, 2);

}

newPo() {
  this.newPO = new PurchaseOrder();
  this.poForm = this.createFormGroup();
  this.formControlValueChanged();
}

formControlValueChanged() {

  this.poForm.get('poFinal').valueChanges.subscribe(
    _poFinal => {
      console.log('poFinal changed ' + _poFinal);
      if ( _poFinal) {
     console.log('Kick off Po Final validation');
      }
    });
/*
  this.poForm.valueChanges.subscribe(
      _poAmount => {
      console.log('poAmount changed ' + _poAmount);
          if ( _poAmount >= 0) {
            this.poForm.patchValue({'adminFeeDue': this.calculateAdminFee(_poAmount)});
          }
  }); */

  this.poForm.get('poAmount').valueChanges.subscribe(
    _poAmount => {
      if ( _poAmount > 0) {
      console.log(this.calculateAdminFee(_poAmount));
      this.poForm.patchValue({'adminFeeDue': this.calculateAdminFee(_poAmount)});
      }
    });

    /*

   this.poForm.get('poAmount').valueChanges.subscribe(
      _actualPo => {
        if ( _actualPo > 0) {
        console.log(this.calculateAdminFee(_actualPo));
        this.poForm.patchValue({'adminFeeDue': this.calculateAdminFee(_actualPo)});
        }
      });
*/
   this.poForm.get('cityAgency').valueChanges.subscribe(
        _cityAgency => {
          this.poService.getPayCode(_cityAgency).subscribe(cd => {
           // this.poForm.payCd = cd[0].agencyPayCode; 
            this.poForm.controls['payCd'].patchValue(cd[0].agencyPayCode, {emitEvent : false});
          });
      });

   this.poForm.get('bidNumber').valueChanges.subscribe(
       _bidNumber => {

        // Need to get list of dealers that are in the DealerBidAssoc
        this.poService.getDealerAssoc(_bidNumber)
        .subscribe(_dealers => {
            this.dealers = _dealers;
        });

          this.poService.getAdminFee(_bidNumber).subscribe(bid => {this.currentBid = bid[0];
          console.log(this.currentBid.AdminFeeRate);
          this.poForm.controls['bidType'].patchValue(this.currentBid.BidType, {emitEvent : false});
          });
    });

}

getSuck() {
  return this.enableVehicleType;
}

formatDate(dateVal: Date) {
  console.log(dateVal);
//  dateVal.setHours(2);
  const myDate = this.dateFormatPipe.transform(dateVal);
  console.log(myDate);
  return myDate;

}

copyModelToForm() {

  if (this.currentPO != null) {

    this.poService.getAdminFee(this.currentPO.bidNumber).subscribe(bid => {this.currentBid = bid[0]; });

    const fname: string = this.currentPO.dealerName;
    console.log(fname);

    this.poForm.controls['bidNumber'].patchValue(this.currentPO.bidNumber, {emitEvent : false});
    this.poForm.controls['poNumber'].patchValue(this.currentPO.poNumber, {emitEvent : false});
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
      poIssueDate: new FormControl('', Validators.required),
      dateReported: new FormControl('', Validators.required),
      estimatedDelivery: new FormControl(),
      cityAgency: new FormControl('', Validators.required),
      dealerName: new FormControl('', Validators.required),
  //    spec: new FormControl('', Validators.required),
  //    vehicleType: new FormControl('', Validators.required),
      agencyFlag: new FormControl(),
      bidType: new FormControl(),
      dealerFlag: new FormControl(),
      poStatus: new FormControl(),
      poFinal: new FormControl(),
      qty: new FormControl({required: true}),
      poAmount: new FormControl(),
      actualPo: new FormControl(),
      adminFeeDue: new FormControl({disabled: true}),
      comments: new FormControl(),
      payCd: new FormControl()
    }, this.validateFormDates);
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
  this.currentPO.estimatedDelivery = this.formatDate(this.poForm.controls.estimatedDelivery.value);
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

validateFormDates(g: FormGroup) {

  const poDate: Date = g.get('poIssueDate').value;
  const reporteddate: Date = g.get('dateReported').value;
  const isValid:  boolean = reporteddate > poDate;

 return isValid ? null : {mismatch: true};

}

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

    this.isNew = false;

    this.poService.createPurchaseOrder(this.newPO).subscribe(po => {
    });

    this.refreshPurchaseOrderList.emit(this.newPO.bidNumber);

     this.toastr.success('Purchase Order Insert Successful', 'Purchase Insert', {
      timeOut: 2000,
      });

  }

  updatePo() {

    this.poService.updatePurchaseOrder(this.currentPO).subscribe(po => {
    });


   this.refreshPurchaseOrderList.emit(this.currentPO.bidNumber);

     this.toastr.success('Purchase Order Save Successful', 'Purchase Update', {
      timeOut: 2000,
      });

  }

  processPurchaseOrder() {

    // Determine if the action is an update or insert of the PO.

     if (this.poForm.invalid) {
       this.dateFailed = true;
       return;
     } else {
        this.dateFailed = false;


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
