import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../util/constants';
import { PurchaseOrder, Payment, AgencyType, Item } from '../model/index';
import { Dealer } from '../model/dealer';
const url = Constants.SERVER_URL + 'api/transaction/bid/';
const dealerUrl = Constants.SERVER_URL + 'api/dealer/';
const paymentUrl =  Constants.SERVER_URL +  'api/transaction/payment/';
const vehicleTypeUrl = Constants.SERVER_URL + 'api/vehicleType/';

const itemPoUrl = Constants.SERVER_URL + 'api/item/purchaseOrder/';
const agencyTypeUrl = Constants.SERVER_URL + 'api/agencyType/';

const itemByIdUrl =  Constants.SERVER_URL + 'api/item/bid/';
const itemUrl = Constants.SERVER_URL + 'api/item/';
const feeUrl = Constants.SERVER_URL +  'api/fee/';

// app.get("/api/item/bid/:bidId", fsaCodeServices.getItemTypeByBid);
// app.get("/api/item/:bidId/:itemId", fsaCodeServices.getItemType);

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {
}


getFee(payee: string, bidType: string, payCd: string) {
  console.log(payee + '  '  + bidType + '  ' + payCd);
  const fee: string = feeUrl + payee + '/' + bidType + '/' + payCd;
  return this.http.get(fee, this.jwt()).map((response: Response) => response.json());
}

getDealerObservable(): Observable<Dealer[]> {
  return this.http.get(dealerUrl, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getPayment(id: number) {
  return this.http.get(paymentUrl + id, this.jwt()).map((response: Response) => response.json());
}

// Get List of Items for selected PO
getItemByPo(poId: number) {
  return this.http.get(itemPoUrl + poId, this.jwt()).map((response: Response) => response.json());
}


// Get Item details per ItemNumber
getItemById(itemId: number) {
  return this.http.get(itemUrl + itemId, this.jwt()).map((response: Response) => response.json());
}

// For select value for an Item.  First select the Item Type this will bring back large number of
// rows as defined for the bid FsaCppBidItemCodes 
getItemByBidId(bidId: string) {
  return this.http.get(itemByIdUrl + bidId, this.jwt()).map((response: Response) => response.json());
}

// Small subset of items that are filtered based on the bidNumber and the ItemNumber from the code table FsaCppBidItemCodes 
getItemType(bidNumber: string, itemId: string) {
  return this.http.get(itemUrl + bidNumber + '/' + itemId, this.jwt()).map((response: Response) => response.json());
}

getPayCode(agencyName: string) {
  return this.http.get(agencyTypeUrl + agencyName, this.jwt()).map((response: Response) => response.json());
}

updatePayment(payment: Payment) {
  const fug = paymentUrl + payment.id;

 return this.http.put(fug, payment, this.jwt()).map((response: Response) => response.json());
}

updateItem(item: Item) {
  const fug = itemUrl + item.id;

 return this.http.put(fug, item, this.jwt()).map((response: Response) => response.json());
}

private handleError (error: any) {
  // In a real world app, we might use a remote logging infrastructure
  // We'd also dig deeper into the error to get a better message
  const errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  console.error(errMsg); // log to console instead
  return Observable.throw(errMsg);
}

delete(id: number) {
  return this.http.delete(url + id, this.jwt()).map((response: Response) => response.json());
}

getByBidNumber(bidNumber: string): Observable<PurchaseOrder[]> {
  return this.http.get(url + bidNumber, this.jwt()).map((response: Response) => response.json());
}

private jwt() {
  // create authorization header with jwt token
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.token) {
  //    const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      const headers = new Headers({ 'Authorization': currentUser.token });
      return new RequestOptions({ headers: headers });
  }
}


}
