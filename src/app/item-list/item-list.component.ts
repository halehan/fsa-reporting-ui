import { Component, Input, ViewChild, OnInit, AfterViewInit,  ElementRef, Output,  EventEmitter} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource , MatSort} from '@angular/material';
import { PurchaseOrder, Dealer, CityAgency, BidType, Payment, BidNumber,
  ItemBidTypeCode, PoStatusType, Specification, AgencyType, Item } from '../model/index';
import { DateFormatPipe } from '../dateFormat/date-format-pipe.pipe';
import { ItemService } from '../services/item.service';
import { ItemDetailComponent } from '../item-detail/item-detail.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  itemListDS = new MatTableDataSource();
  itemColumns = ['itemNumber', 'itemDescription',  'itemType', 'itemModel', 'qty', 'itemAmount', 'edit', 'delete'];
  @ViewChild(ItemDetailComponent) itemDetail: ItemDetailComponent;

  @Input() poId: number;
  @Input() fsaId: number;

  @Input() bidType: string;
  @Input() currentBid: BidNumber;
  @Input() payCd: string;

  constructor( private itemService: ItemService) { }

  ngOnInit() {

    this.getItems(this.poId);

    console.log('BidNumber ' + this.currentBid.BidNumber);
    console.log('BidType ' + this.currentBid.BidType);
    console.log('BidTitle ' + this.currentBid.BidTitle);
    console.log('AdminFeeRate ' + this.currentBid.AdminFeeRate);
    console.log('PO id ' + this.poId);

  }

  getItems(poId: number) {

    this.itemService.getItemByPo(poId)
    .subscribe(items => {
        this.itemListDS.data = items;
    });

  }

  onSelect(item: Item): void {

    this.itemDetail.getItem(item.id);
    console.log();

  }

  onSelectPayment(item: Item) {

   }

}
