
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';


import { AuthenticationService } from './authentication.service';
import { Message } from '../model/index';
import { Constants } from '../util/constants';

@Injectable()
export class MessageService {

  constructor(
    private http: Http,
    private authenticationService: AuthenticationService) {
}

closeThread(message: Message) {
  return this.http.post(Constants.MESSAGES_SERVER_URL + 'messages/closethread', message, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

sendMessage(message: Message) {
  return this.http.post(Constants.MESSAGES_SERVER_URL + 'messages/sendmessage', message, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getAll(): Observable<Message[]> {
  return this.http.get(Constants.MESSAGES_SERVER_URL + 'messages', this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

getById(id: number) {
  return this.http.get(Constants.MESSAGES_SERVER_URL + 'messages' + id, this.jwt()).map((response: Response) =>
    response.json()).catch(this.handleError);
}

private handleError (error: Response | any) {
  console.error('messageService::handleError' + error);
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
