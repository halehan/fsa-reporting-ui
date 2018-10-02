
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Constants } from '../util/constants';

@Injectable()
export class ContentService {

  constructor( private http: Http) { }

  getByName(name: string): Observable<any> {
    return this.http.get(Constants.SERVER_URL + 'api/content/' + name, this.jwt()).map((response: Response) => response.json());
  }

  getByNameOld(name: string) {
    return this.http.get(Constants.SERVER_URL + 'api/content/' + name, this.jwt()).map((response: Response) =>
      response.json()).catch(this.handleError);
  }

  private handleError (error: Response | any) {
    console.error('contentService::handleError' + error);
    return observableThrowError(error);
  }

  private jwt() {
    // create authorization header with jwt token
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
    //    const headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
        const headers = new Headers({ 'Authorization': currentUser.token,  'x-access-token': currentUser.token } );
        console.log(headers);
        return new RequestOptions({ headers: headers });
    }
}

}
