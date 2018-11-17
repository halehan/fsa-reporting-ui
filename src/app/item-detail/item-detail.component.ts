import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PurchaseOrder } from '../model/index';
import { BidNumber, Item, AdminFeeDistributionPct } from '../model/index';
import { ContactRequest } from '../model/contact-request';
import { PersonalData } from '../model/contact-request';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { ItemService } from '../services/item.service';
import { ToastrService } from 'ngx-toastr';
import { ItemBidTypeCode } from '../model/itemBidTypeCode';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';




@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  itemForm: FormGroup;
  itemTypeCodes: ItemBidTypeCode[] = [];
  itemTypeMakeCodes: ItemBidTypeCode[] = [];
  fsaFeeObj: AdminFeeDistributionPct;
  facFeeObj: AdminFeeDistributionPct;
  ffcaFeeObj: AdminFeeDistributionPct;
  fsaFee: number;
  facFee: number;
  ffcaFee: number;
  adminFeeRate: number;
  bidType: string;

  newItem: Item;
  currentItem: Item;

  @Input() currentBid: BidNumber;
  @Input() payCd: string;
  @Input() poId: number;
  @Input() enableItemDetail: boolean;
  @Output() refreshItemList: EventEmitter<number> =   new EventEmitter();
  @ViewChild('itemFocus') itemFocus: ElementRef;

  isNew: boolean;
  showDetail: boolean;

  constructor(private poService: PurchaseOrderService, private itemService: ItemService, private toastr: ToastrService) {
    this.isNew = false;
    this.showDetail = false;
  }

  focusItem () {

    this.delay(100).then(any => {
      this.itemFocus.nativeElement.focus();
  });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }

  postInitFees() {

    console.log(this.currentBid.BidNumber);
    console.log(this.currentBid.BidType);

    this.adminFeeRate = parseFloat(this.currentBid.AdminFeeRate);

    this.itemService.getItemByBidId(this.currentBid.BidNumber)
    .subscribe(items => {
        this.itemTypeCodes = items;
        console.log(this.itemTypeCodes);
    });

    this.itemService.getFee('FSA', this.currentBid.BidType, this.payCd)
    .subscribe(fsa => {
        this.fsaFeeObj = fsa[0];
        console.log(this.fsaFeeObj);
    });

    this.itemService.getFee('FAC', this.currentBid.BidType, this.payCd )
    .subscribe(fac => {
        this.facFeeObj = fac[0];
        console.log(this.facFeeObj);
    });

    this.itemService.getFee('FFCA', this.currentBid.BidType, this.payCd )
    .subscribe(ffca => {
        this.ffcaFeeObj = ffca[0];
        console.log(this.ffcaFeeObj);
    });

    this.formControlValueChanged();

  }

  ngOnInit() {

    console.log('poID = ' + this.poId);

    this.itemForm = this.createFormGroup();
    this.enableItemDetail = false;

  //  console.log(this.currentBid.BidNumber);
  //  console.log(this.currentBid.BidType);
  //  console.log(this.currentBid.AdminFeeRate);
   // console.log(this.poId);

    this.formControlValueChanged();

  }

  getItemSpecific(bidId: string, itemId: number) {

    this.itemService.getItemType(this.currentBid.BidNumber, itemId)
    .subscribe(items => {
        this.itemTypeMakeCodes = items;
        console.log(this.itemTypeMakeCodes);
    });

  }

  createFormGroup() {

    return new FormGroup({

        itemNumber: new FormControl('', Validators.required),
        itemType: new FormControl('', Validators.required),
        bidItemCodeId: new FormControl(),
        itemModelNumber: new FormControl(),
        itemDescription: new FormControl(),
        itemMake: new FormControl(),
        itemAmount: new FormControl('', Validators.required),
        qty: new FormControl('', Validators.required),
        adminFeeDue: new FormControl({disabled: true}),
        fsafee: new FormControl(),
        facfee: new FormControl(),
        ffcaFee: new FormControl()
      });

  }

  formControlValueChanged() {

    console.log('in the formControlValueChanged');

     this.itemForm.get('itemNumber').valueChanges.subscribe(_item => {
       if (this.isNew ) {
         this.newItem.itemNumber = _item;
       } else {
        this.currentItem.itemNumber = _item;
       }

                console.log(_item);

                this.itemService.getItemType(this.currentBid.BidNumber, _item)
                  .subscribe(data => {this.itemTypeMakeCodes = data; });

                  console.log(this.itemTypeMakeCodes);
                });

      this.itemForm.get('bidItemCodeId').valueChanges.subscribe(_type => {
                 console.log(_type);

      if ( _type !== 'Select Item Type') {

        this.itemService.getItemByBidCodeId( _type )
        .subscribe(_derived => {

       //   this.itemService.getDerivedItem(this.currentBid.BidNumber, this.currentItem.itemNumber, _type )
      //     .subscribe(_derived => {
            this.itemForm.controls['itemType'].patchValue(_derived[0].itemType, {emitEvent : false});
            this.itemForm.controls['itemDescription'].patchValue(_derived[0].itemDescription, {emitEvent : false});
            this.itemForm.controls['itemMake'].patchValue(_derived[0].itemMake, {emitEvent : false});
            this.itemForm.controls['itemModelNumber'].patchValue(_derived[0].itemModelNumber, {emitEvent : false});
            this.itemForm.controls['bidItemCodeId'].patchValue(_derived[0].id, {emitEvent : false});
              console.log(_derived[0].itemDescription);
              console.log(_derived[0].itemMake);
              console.log(_derived[0].itemModelNumber);
              console.log(_derived[0].id);
       });

      }
  });

        this.itemForm.get('itemAmount').valueChanges.subscribe(_amount => {

        const adminFee: number = this.calculateFee(_amount, this.adminFeeRate);

        this.itemForm.controls['adminFeeDue'].patchValue(adminFee, {emitEvent : false});

        if ( this.ffcaFeeObj  === undefined) {
          this.ffcaFee = 0;
        } else {
          this.ffcaFee = this.ffcaFeeObj.distributionPct;
        }

        if ( this.facFeeObj === undefined) {
          this.facFee = 0;
        } else {
          this.facFee = this.facFeeObj.distributionPct;
        }

        if (this.fsaFeeObj === undefined) {
          this.fsaFee = 0;
        } else {
          this.fsaFee = this.fsaFeeObj.distributionPct;
        }

        this.itemForm.controls['fsafee'].patchValue(this.calculateFee(adminFee, this.fsaFee), {emitEvent : false});
        this.itemForm.controls['facfee'].patchValue(this.calculateFee(adminFee, this.facFee), {emitEvent : false});
        this.itemForm.controls['ffcaFee'].patchValue(this.calculateFee(adminFee, this.ffcaFee), {emitEvent : false});

        console.log('FAC Rate = ' + this.facFee);
        console.log('FSA Rate = ' + this.fsaFee);
        console.log('FFCA Rate = ' + this.ffcaFee);
                    console.log(_amount);
                      });

  }

  truncateDecimals(poAmount: number, places: number) {
    const shift = Math.pow(10, places);
   return ((poAmount * shift) | 0) / shift;
  };

  calculateAdminFee(poAmount: number, fee: number) {
   // return poAmount * fee;
    return this.truncateDecimals(poAmount * fee, 2);
  }

  calculateFee(amount: number, fee: number) {
    return this.truncateDecimals(amount * fee, 2);
  }

  copyModelToForm() {

    if (this.currentItem != null) {

      this.itemForm.controls['itemNumber'].patchValue(this.currentItem.itemNumber, {emitEvent : false});
      this.itemForm.controls['bidItemCodeId'].patchValue(this.currentItem.bidItemCodeId, {emitEvent : false});
      this.itemForm.controls['itemType'].patchValue(this.currentItem.itemType, {emitEvent : false});
      this.itemForm.controls['itemAmount'].patchValue(this.currentItem.itemAmount, {emitEvent : false});
      this.itemForm.controls['itemModelNumber'].patchValue(this.currentItem.itemModelNumber, {emitEvent : false});
      this.itemForm.controls['itemDescription'].patchValue(this.currentItem.itemDescription, {emitEvent : false});
      this.itemForm.controls['itemMake'].patchValue(this.currentItem.itemMake, {emitEvent : false});
      this.itemForm.controls['qty'].patchValue(this.currentItem.qty, {emitEvent : false});
      this.itemForm.controls['adminFeeDue'].patchValue(this.currentItem.adminFeeDue, {emitEvent : false});
      this.itemForm.controls['fsafee'].patchValue(this.currentItem.fsaFee, {emitEvent : false});
      this.itemForm.controls['facfee'].patchValue(this.currentItem.facFee, {emitEvent : false});
      this.itemForm.controls['ffcaFee'].patchValue(this.currentItem.ffcaFee, {emitEvent : false});

       }

    }

    copyFormToModel() {

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.currentItem.itemNumber = this.itemForm.controls.itemNumber.value;
      this.currentItem.bidItemCodeId = this.itemForm.controls.bidItemCodeId.value;
      this.currentItem.itemType = this.itemForm.controls.itemType.value;
      this.currentItem.itemAmount = this.itemForm.controls.itemAmount.value;
      this.currentItem.itemDescription = this.itemForm.controls.itemDescription.value;
      this.currentItem.itemModelNumber = this.itemForm.controls.itemModelNumber.value;
      this.currentItem.itemMake = this.itemForm.controls.itemMake.value;
      this.currentItem.adminFeeDue = this.itemForm.controls.adminFeeDue.value;
      this.currentItem.qty = this.itemForm.controls.qty.value;
      this.currentItem.fsaFee = this.itemForm.controls.fsafee.value;
      this.currentItem.facFee = this.itemForm.controls.facfee.value;
      this.currentItem.ffcaFee = this.itemForm.controls.ffcaFee.value;
      this.currentItem.fsaCppPurchaseOrderId = this.poId;
      this.currentItem.updatedBy = currentUser.username;

      }

    copyFormToNewModel() {

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      this.newItem.itemNumber = this.itemForm.controls.itemNumber.value;
      this.newItem.bidItemCodeId = this.itemForm.controls.bidItemCodeId.value;
      this.newItem.itemType = this.itemForm.controls.itemType.value;
      this.newItem.itemAmount = this.itemForm.controls.itemAmount.value;
      this.newItem.itemDescription = this.itemForm.controls.itemDescription.value;
      this.newItem.itemModelNumber = this.itemForm.controls.itemModelNumber.value;
      this.newItem.itemMake = this.itemForm.controls.itemMake.value;
      this.newItem.adminFeeDue = this.itemForm.controls.adminFeeDue.value;
      this.newItem.qty = this.itemForm.controls.qty.value;
      this.newItem.fsaFee = this.itemForm.controls.fsafee.value;
      this.newItem.facFee = this.itemForm.controls.facfee.value;
      this.newItem.ffcaFee = this.itemForm.controls.ffcaFee.value;
      this.newItem.fsaCppPurchaseOrderId = this.poId;
      this.newItem.createdBy  = currentUser.username;


      }

  createItem() {

      this.postInitFees();
      this.isNew = true;
      this.newItem = new Item();
      this.itemForm = this.createFormGroup();
      this.formControlValueChanged();

    }

  getItem(itemId: number) {

    this.postInitFees();

    this.itemService.getItemById(itemId)
    .subscribe(item => {
        this.currentItem = item[0];
        this.enableItemDetail = (item.length > 0 ? true : false);
        this.copyModelToForm();
        this.populateItemTypeSelect(this.currentBid.BidNumber, this.currentItem.itemNumber);
    });

  }

  populateItemTypeSelect(bidNumber: string, itemNumber: number) {

    this.itemService.getItemType(bidNumber, itemNumber)
    .subscribe(data => {this.itemTypeMakeCodes = data; });

  }

  updateItem() {

    this.itemService.updateItem(this.currentItem).subscribe(_item => {
        });

        this.refreshItemList.emit(this.currentItem.fsaCppPurchaseOrderId);

       this.toastr.success('Item Update Successful', 'Item Update', {
        timeOut: 2000,
        });

    }

    insertItem() {

      this.isNew = false;

      this.itemService.insertItem(this.newItem).subscribe(_item => {
          });

        this.refreshItemList.emit(this.poId);

         this.toastr.success('Item Insert Successful', 'Item Insert', {
          timeOut: 2000,
          });

      }


  processItem() {

    // Determine if the action is an update or insert of the PO.

    if (this.isNew) {
      this.copyFormToNewModel();
      this.insertItem();
    } else {
      this.copyFormToModel();
      this.updateItem();
    }


  }



}
