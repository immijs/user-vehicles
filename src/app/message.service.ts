import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Message } from './shared/message.model';

@Injectable()
export class MessageService {
  private messages: Message[] = [];
  private displayMessages: Subject<Message> = new Subject<Message>();
  
  constructor() { }

  public addMessage(message: Message): void {
    this.messages.push(message);
  }

  public addDisplayMessage(message: Message): void {
    this.addMessage(message);
    this.displayMessages.next(message);
  }

  public getMessages(): Observable<Message[]> {
    return of(this.messages);
  }

  public getDisplayMessages(): Observable<Message> {
    return this.displayMessages;
  }
}
