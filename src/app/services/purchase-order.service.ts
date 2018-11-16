import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthenticationService } from './authentication.service';
import { Constants } from '../util/constants';
import { PurchaseOrder, Payment, AgencyType } from '../model/index';
import { Dealer } from '../model/dealer';
import { PoStatusType } from '../model/poStatusType';
const url = Constants.SERVER_URL + 'api/transaction/bid/';
const cityAgencyUrl = Constants.SERVER_URL + 'api/cityAgency/';
const dealerUrl = Constants.SERVER_URL + 'api/dealer/';
const poUrl =  Constants.SERVER_URL +  'api/transaction/';
const bidTypeUrl =  Constants.SERVER_URL +  'api/bidType/';
const paymentUrl =  Constants.SERVER_URL +  'api/transaction/payment/';
const bidNumberUrl = Constants.SERVER_URL + 'api/bidNumberType/';
const vehicleTypeUrl = Constants.SERVER_URL + 'api/vehicleType/';
const insertPurchaseOrderUrl = Constants.SERVER_URL + 'api/transaction/';
const bidsUrl = Constants.SERVER_URL + 'api/transaction/bids/';
const specTypeUrl = Constants.SERVER_URL + 'api/specification/';
const poStatusTypeUrl = Constants.SERVER_URL + 'api/poStatusType/';
const agencyTypeUrl = Constants.SERVER_URL + 'api/agencyType/';
const poByIdUrl = Constants.SERVER_URL + 'api/transaction/';
const adminFeeUrl = Constants.SERVER_URL + 'api/bidType/';


@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {
}

createPayment(payment: Payment) {
  return this.http.post(paymentUrl, payment, this.jwt()).map((response: Response) => response.json());
}

createPurchaseOrder(purchaseOrder: PurchaseOrder) {
  return this.http.post(insertPurchaseOrderUrl, purchaseOrder, this.jwt()).map((response: Response) => response.json());
}

updatePurchaseOrder(purchasOrder: PurchaseOrder) {
  return this.http.put(poUrl,  purchasOrder, this.jwt()).map((response: Response) => response.json());
 }


getPostatusType(): Observable<PoStatusType[]> {
  return this.http.get(poStatusTypeUrl, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getByLogin(loginId: string): Observable<any> {
  return this.http.get(url + loginId, this.jwt()).map((response: Response) => response.json());
}

getPoById(id: number): Observable<PurchaseOrder> {
  return this.http.get(poByIdUrl + id, this.jwt()).map((response: Response) => response.json());
}

getAdminFee(id: string) {
  return this.http.get(adminFeeUrl + id, this.jwt()).map((response: Response) => response.json());
}

getById(id: number) {
  return this.http.get(url + id, this.jwt()).map((response: Response) => response.json());
}

getDealerObservable(): Observable<Dealer[]> {
  return this.http.get(dealerUrl, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getPaymentObservable(id: number): Observable<Payment[]> {
  return this.http.get(paymentUrl, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getPayment(id: number) {
  return this.http.get(paymentUrl + id, this.jwt()).map((response: Response) => response.json());
}

getBids() {
  return this.http.get(bidsUrl, this.jwt()).map((response: Response) => response.json());
}

getBidType() {
  return this.http.get(bidTypeUrl, this.jwt()).map((response: Response) => response.json());
}

getBidNumber() {
  return this.http.get(bidNumberUrl, this.jwt()).map((response: Response) => response.json());
}

getItembyId(itemId: number) {
  return this.http.get(specTypeUrl + itemId, this.jwt()).map((response: Response) => response.json());
}

getItem(bidNumber: string) {
  return this.http.get(specTypeUrl + bidNumber, this.jwt()).map((response: Response) => response.json());
}

getItemType(bidNumber: string, itemId: string) {
  return this.http.get(vehicleTypeUrl + bidNumber + '/' + itemId, this.jwt()).map((response: Response) => response.json());
}

getCityAgency() {
  return this.http.get(cityAgencyUrl, this.jwt()).map((response: Response) => response.json());
}

getPayCode(agencyName: string) {
  return this.http.get(agencyTypeUrl + agencyName, this.jwt()).map((response: Response) => response.json());
}

getDealer() {
  return this.http.get(dealerUrl, this.jwt()).map((response: Response) => response.json());
}

/*
insertPurchaseOrder(purchaseOrder: PurchaseOrder) {
  return this.http.post(insertPurchaseOrderUrl, purchaseOrder, this.jwt()).map((response: Response) => response.json());
}
*/

updatePayment(payment: Payment) {
  const fug = paymentUrl + payment.id;
 return this.http.put(fug, payment, this.jwt()).map((response: Response) => response.json());
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
