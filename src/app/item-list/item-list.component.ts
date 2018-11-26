import { Component, Input, ViewChild, OnInit, AfterViewInit,  ElementRef, Output,  EventEmitter} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource , MatSort} from '@angular/material';
import { PurchaseOrder, Dealer, CityAgency, BidType, Payment, BidNumber,
  ItemBidTypeCode, PoStatusType, Specification, AgencyType, Item } from '../model/index';
import { ToastrService } from 'ngx-toastr';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import { ItemService } from '../services/item.service';
import { ItemDetailComponent } from '../item-detail/item-detail.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, AfterViewInit {

  itemListDS = new MatTableDataSource();
  itemColumns = ['itemNumber', 'itemDescription',  'itemType', 'itemMake', 'itemModel', 'qty', 'itemAmount', 'adminFeeDue',
  'edit', 'delete'];
  @ViewChild(ItemDetailComponent) itemDetail: ItemDetailComponent;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() poId: number;
  @Input() fsaId: number;

  @Input() bidType: string;
  @Input() currentBid: BidNumber;
  @Input() payCd: string;
  @Input() enableItemDetail: boolean;

  enableList: boolean;

  selectedItem: Item;

  rowSelected: boolean;

  constructor( private itemService: ItemService, private toastr: ToastrService) { }

  refreshItemListHandler(poId: number) {
    this.refreshPoList(poId);
  }

  deleteItem (row) {

    if ( confirm('Are you sure you want to delete Item ? ' + row.id + '  ' + row.itemDescription ) ) {

      this.itemService.deleteItem(row.id).subscribe(po => {
      });

  // this.enablePoDetail = false;
      this.enableItemDetail = false;
   //   this.enableItemList = false;

      this.refreshPoList(row.fsaCppPurchaseOrderId);

       this.toastr.success('Payment delete Successful', 'Payment Delete', {
        timeOut: 2000,
        });

    }

  }


refreshPoList(poId: number) {


     this.delay(1000).then(any => {
     this.getItems(poId);
     });

}

async delay(ms: number) {
  await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
}

  chain () {
      this.enableItemDetail = true;
      this.itemDetail.createItem();
      this.itemDetail.focusItem();

  }

  ngOnInit() {
    this.enableList = false;

    this.getItems(this.poId);

  


   // console.log('BidNumber ' + this.currentBid.BidNumber);
  //  console.log('BidType ' + this.currentBid.BidType);
   // console.log('BidTitle ' + this.currentBid.BidTitle);
   // console.log('AdminFeeRate ' + this.currentBid.AdminFeeRate);
   // console.log('PO id ' + this.poId);

  }

  ngAfterViewInit() {

    this.itemListDS.sort = this.sort;
    this.itemListDS.paginator = this.paginator;

  }

  setItemListRowSelected(val: boolean) {
    this.rowSelected = val;
  }

  getItems(poId: number) {

    this.enableItemDetail = false;

    this.itemService.getItemByPo(poId)
    .subscribe(items => {
        this.itemListDS.data = items;
   //     this.enableItemDetail = (items.length > 0 ? true : false);
           this.enableList  = (items.length > 0 ? true : false);
    });

  }

  onSelect(item: Item): void {
    this.selectedItem = item;

    this.enableItemDetail = true;

    this.setItemListRowSelected(true);
    this.itemDetail.getItem(item.id);
    console.log();

    this.itemDetail.focusItem();

  }

  onSelectPayment(item: Item) {

   }

}
