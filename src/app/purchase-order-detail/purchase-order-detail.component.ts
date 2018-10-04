
import { Component, ViewChild, OnInit, AfterViewInit, Output, EventEmitter,  OnChanges, SimpleChanges, Input  } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
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
  countries = ['USA', 'Germany', 'Italy', 'France'];
  requestTypes = ['Claim', 'Feedback', 'Help Request'];
  cityAgencies: CityAgency[] = [];
  bidTypes: BidType[] = [];
  bidNumbers: BidNumber[] = [];

  dealers: Dealer[] = [];
  newPO: PurchaseOrder;
  POForm: FormGroup;
  default: String = 'UK';
  enableSpec: Boolean = false;
  enableVehicleType: String = 'disabled';
  specs: Specification[] = [];
  vehicleTypeCodes: VehicleTypeCodes[] = [];
  savedBid: string;
  poStatusTypeCodes: PoStatusType[] = [];
  newPoForm: FormGroup;
  dateFailed: boolean;


  constructor(private poService: PurchaseOrderService, private toastr: ToastrService, private fb: FormBuilder,
    private dateFormatPipe: DateFormatPipe) {
   this.contactForm = this.createFormGroupWithBuilder(fb);
    this.POForm  = new FormGroup({
      state: new FormControl(this.dealers),
    });

    this.newPO = new PurchaseOrder();

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

}

purchaserChange(event)  {

  const newVal = event.target.value;

  this.poService.getPayCode(newVal)
  .subscribe(cd => {
  this.newPO.payCd = cd[0].agencyPayCode;

});

}

getSuck() {
  return this.enableVehicleType;
}


createFormGroupWithBuilder(fb: FormBuilder) {
  return this.fb.group({
    requestType: ['', [Validators.required, Validators.minLength(2)]],
    text: [''],
    personalData: this.fb.group({
      email: ['duser@fsa.gov', [Validators.required, Validators.minLength(2)]],
      mobile: ['', Validators.required],
      country: ['', Validators.required]
    })
  });
}

createFormGroup() {

  return new FormGroup({

      bidNumber: new FormControl('', Validators.required),
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

// convenience getter for easy access to form fields
get f() { return this.newPoForm.controls; }

test() {
  console.log();
}

validateFormDates(g: FormGroup) {

  const poDate: Date = g.get('poIssueDate').value;
  const reporteddate: Date = g.get('dateReported').value;
  const isValid:  boolean = poDate > reporteddate;

 return reporteddate > poDate ? null : {'mismatch': true};


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

calculateAdminFee(poAmount: number) {
    return poAmount * .07;

  }


  insertPurchaseOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.copyFormToModel();
    let adminCalc: number;

    if (this.newPoForm.invalid) {
      this.dateFailed = true;
      return;
  } else {
    this.dateFailed = false;
    if ( Number(this.newPO.actualPo) > 0 ) {
      adminCalc = this.calculateAdminFee(Number(this.newPO.actualPo));
    } else if (Number(this.newPO.poAmount) > 0 )   {
      adminCalc = this.calculateAdminFee(Number(this.newPO.poAmount));
    }

    this.newPO.adminFeeDue = adminCalc;
    this.newPO.createdBy = currentUser.username;

    this.poService.createPurchaseOrder(this.newPO).subscribe(po => {
    this.newPO = po;
  });

    this.refreshPurchaseOrderList.emit(this.newPO.bidNumber);

    this.toastr.success('Transaction Saved Successful', 'Transaction Update', {
    timeOut: 2000,
});
  }
  }

  filterSpecifications(filterVal: string) {

    // reset the VehicleTypes
    this.vehicleTypeCodes = null;

    this.poService.getSpec(filterVal)
    .subscribe(data => {
        this.specs = data;
    });

  }

  filterVehicleTypes(filterVal: string) {

    console.log(filterVal);
    console.log(this.newPO.bidNumber);
    console.log(this.newPO.spec);

    this.poService.getVehicleType(this.newPoForm.controls.bidNumber.value, filterVal)
    .subscribe(data => {
        this.vehicleTypeCodes = data;
    });

}

}
