import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MessageService } from '../message.service';
import { Message } from '../shared/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  public messages$: Observable<Message[]>;

  constructor(public messageService: MessageService) { }

  ngOnInit() {
    this.messages$ = this.messageService.getMessages();
  }

}
