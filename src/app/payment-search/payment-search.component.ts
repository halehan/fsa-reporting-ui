
import { Component, Input, ViewChild, OnInit, AfterViewInit,  ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatPaginator, MatTableDataSource , MatSort} from '@angular/material';
import { PurchaseOrderService } from '../services/purchase-order.service';

@Component({
  selector: 'app-payment-search',
  templateUrl: './payment-search.component.html',
  styleUrls: ['./payment-search.component.scss']
})
export class PaymentSearchComponent implements OnInit, AfterViewInit {

  constructor(private poService: PurchaseOrderService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

}
