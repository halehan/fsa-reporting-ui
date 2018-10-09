
import { Component, ViewChild, OnInit, AfterViewInit, Output, EventEmitter,  OnChanges, SimpleChanges, Input  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import {BehaviorSubject, Observable} from 'rxjs';
import { PurchaseOrder } from '../model/index';
import { Dealer, CityAgency, BidType, BidNumber, PoStatusType, Specification } from '../model/index';
import { ContactRequest } from '../model/contact-request';
import { PersonalData } from '../model/contact-request';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ToastrService } from 'ngx-toastr';
import { VehicleTypeCodes } from '../model/vehicleType';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent implements OnInit  {

  @Output() refreshPurchaseOrderList: EventEmitter<string> =   new EventEmitter();

  contactForm: FormGroup;
  cityAgencies: CityAgency[] = [];
  bidTypes: BidType[] = [];
  bidNumbers: BidNumber[] = [];

  dealers: Dealer[] = [];
  newPO: PurchaseOrder;

  enableSpec: Boolean = false;
  enableVehicleType: String = 'disabled';
  specs: Specification[] = [];
  vehicleTypeCodes: VehicleTypeCodes[] = [];
  savedBid: string;
  poStatusTypeCodes: PoStatusType[] = [];
  newPoForm: FormGroup;
  dateFailed: boolean;
  currentBid: BidNumber;

  constructor(private poService: PurchaseOrderService, private toastr: ToastrService, private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe) {this.newPO = new PurchaseOrder(); }

get poAmount() {
  return this.newPoForm.get('poAmount');
 }

ngOnInit() {

  this.newPoForm = this.createFormGroup();

  this.poService.getPostatusType()
  .subscribe(codes => {
    this.poStatusTypeCodes = codes;
});

  this.poService.getDealer()
  .subscribe(_dealers => {
      this.dealers = _dealers;
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
 return this.truncateDecimals(poAmount * this.currentBid.AdminFeeRate, 2);
// return this.truncateDecimals(poAmount * .07, 2);

}

formControlValueChanged() {

  this.poAmount.valueChanges.subscribe(
      _poAmount => {
      console.log('poAmount changed ' + _poAmount);
      if ( !(this.newPoForm.get('actualPo').value >= 0)) {
          if ( _poAmount >= 0) {
            this.newPoForm.patchValue({'adminFeeDue': this.calculateAdminFee(_poAmount)});
          }
      }
  });

   this.newPoForm.get('actualPo').valueChanges.subscribe(
      _actualPo => {
        if ( _actualPo > 0) {
        console.log(this.calculateAdminFee(_actualPo));
        this.newPoForm.patchValue({'adminFeeDue': this.calculateAdminFee(_actualPo)});
        }
      });

   this.newPoForm.get('cityAgency').valueChanges.subscribe(
        _cityAgency => {
          this.poService.getPayCode(_cityAgency).subscribe(cd => {this.newPO.payCd = cd[0].agencyPayCode; });
          console.log(this.newPO.payCd);
          });

   this.newPoForm.get('bidNumber').valueChanges.subscribe(
       _bidNumber => {
          this.vehicleTypeCodes = null;
          this.poService.getSpec(_bidNumber).subscribe(data => {this.specs = data; });
          this.poService.getAdminFee(_bidNumber).subscribe(bid => {this.currentBid = bid[0];
          console.log(this.currentBid.AdminFeeRate);
    });
          });

   this.newPoForm.get('spec').valueChanges.subscribe(_spec => {
          this.poService.getVehicleType(this.newPoForm.controls.bidNumber.value, _spec)
                .subscribe(data => {this.vehicleTypeCodes = data; });
              });

    this.newPoForm.get('poIssueDate').valueChanges.subscribe(_poIssueDate => {
                  console.log(_poIssueDate);
                  });

}

getSuck() {
  return this.enableVehicleType;
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
      spec: new FormControl('', Validators.required),
      vehicleType: new FormControl('', Validators.required),
      agencyFlag: new FormControl(),
      dealerFlag: new FormControl(),
      poComplete: new FormControl(),
      qty: new FormControl(),
      poAmount: new FormControl(),
      actualPo: new FormControl(),
      adminFeeDue: new FormControl(),
      comments: new FormControl(),
      payCd: new FormControl(),
    }, this.validateFormDates);
}

copyFormToModel() {

  this.newPO.bidNumber = this.newPoForm.controls.bidNumber.value;
  this.newPO.poNumber = this.newPoForm.controls.poNumber.value;
  this.newPO.poIssueDate = this.newPoForm.controls.poIssueDate.value;
  this.newPO.dateReported = this.newPoForm.controls.dateReported.value;
  this.newPO.estimatedDelivery = this.newPoForm.controls.estimatedDelivery.value;
  this.newPO.cityAgency = this.newPoForm.controls.cityAgency.value;
  this.newPO.dealerName = this.newPoForm.controls.dealerName.value;
  this.newPO.spec = this.newPoForm.controls.spec.value;
  this.newPO.vehicleType  = this.newPoForm.controls.vehicleType.value;
  this.newPO.agencyFlag  = this.newPoForm.controls.agencyFlag.value;
  this.newPO.dealerFlag = this.newPoForm.controls.dealerFlag.value;
  this.newPO.poComplete = this.newPoForm.controls.poComplete.value;
  this.newPO.poAmount = this.newPoForm.controls.poAmount.value;
  this.newPO.actualPo = this.newPoForm.controls.actualPo.value;
  this.newPO.adminFeeDue = this.newPoForm.controls.adminFeeDue.value;
  this.newPO.comments = this.newPoForm.controls.comments.value;

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

onSubmit() {
  // Make sure to create a deep copy of the form-model
  const result: ContactRequest = Object.assign({}, this.contactForm.value);
  result.personalData = Object.assign({}, result.personalData);

  // Do useful stuff with the gathered data
  console.log(result);
}

  getCurrentUserName() {
    return JSON.parse(localStorage.getItem('currentUser')).username;
  }


  insertPurchaseOrder() {

     this.copyFormToModel();

     if (this.newPoForm.invalid) {
       this.dateFailed = true;
       return;
     } else {
        this.dateFailed = false;

     this.newPO.createdBy = this.getCurrentUserName();

     this.poService.createPurchaseOrder(this.newPO).subscribe(po => {
  //   this.newPO = po;
  });

    this.refreshPurchaseOrderList.emit(this.newPO.bidNumber);

    this.toastr.success('Transaction Saved Successful', 'Transaction Update', {
    timeOut: 2000,
    });
  }
}


}
