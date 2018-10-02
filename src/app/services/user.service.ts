import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Constants } from '../util/constants';

import { AuthenticationService } from './authentication.service';
import { User } from '../model/index';

 const url = Constants.SERVER_URL + 'api/user/';

@Injectable()
export class UserService {
    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    create(user: User) {
        return this.http.post(url, user, this.jwt()).map((response: Response) => response.json());
    }

    getByLogin(loginId: string): Observable<any> {
        return this.http.get(url + loginId, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(url + id, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        const fug = url + user.loginId;
     //   const once = this.http.put(fug, JSON.stringify(user), this.jwt())
     //   .map(() => user);

   //   const dog =  this.http.put(fug, user, this.jwt()).map((response: Response) => response.json());
    //   return dog;
       return this.http.put(fug, user, this.jwt()).map((response: Response) => response.json());
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

    getAll(): Observable<User[]> {
        return this.http.get(url, this.jwt()).map((response: Response) => response.json());
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
