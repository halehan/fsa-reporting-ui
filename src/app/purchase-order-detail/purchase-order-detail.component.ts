
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


  constructor(private poService: PurchaseOrderService, private toastr: ToastrService, private fb: FormBuilder, private dateFormatPipe: DateFormatPipe) {
   // this.contactForm = this.createFormGroup();
   this.contactForm = this.createFormGroupWithBuilder(fb);
   // this.contactForm = this.createFormGroupWithBuilderAndModel(formBuilder);
    this.POForm  = new FormGroup({
      state: new FormControl(this.dealers),
    });

    this.newPO = new PurchaseOrder();

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

createFormGroupWithBuilderAndModel(formBuilder: FormBuilder) {
  return formBuilder.group({
    personalData: formBuilder.group(new PersonalData()),
    requestType: '',
    text: ''
  });
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
    personalData: new FormGroup({
      email: new FormControl(),
      mobile: new FormControl(),
      country: new FormControl()
    }),
    requestType: new FormControl(),
    text: new FormControl()
  });
}

test() {
  console.log();
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

  ngOnInit() {

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

  calculateAdminFee(poAmount: number) {
    return poAmount * .07;

  }

  insertPurchaseOrder() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let adminCalc: number;
    
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

    this.poService.getVehicleType(this.newPO.bidNumber, filterVal)
    .subscribe(data => {
        this.vehicleTypeCodes = data;
    });

}

}
