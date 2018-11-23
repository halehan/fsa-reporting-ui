import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Constants } from '../util/constants';

const viewByCheckUrl = Constants.SERVER_URL + 'api/transaction/bid/view/';
const viewByCheckListUrl = Constants.SERVER_URL + 'api/transaction/bid/view/list/';
const dealerUrl = Constants.SERVER_URL + '/api/transaction/bid/view/detail/';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: Http) {
}

  getByCheckNumber(checkNumber: string) {
    return this.http.get(viewByCheckUrl + checkNumber, this.jwt()).map((response: Response) => response.json());
  }

  getByCheckNumberDealer(checkNumber: string, dealerName: string) {
    return this.http.get(viewByCheckListUrl + checkNumber + '/' + dealerName, this.jwt()).map((response: Response) => response.json());
  }

  getById(id: string) {
    return this.http.get(dealerUrl + id, this.jwt()).map((response: Response) => response.json());
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
