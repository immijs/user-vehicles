import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { MessageService } from './message.service';
import { Message } from './shared/message.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public snackBar: MatSnackBar, private messageService: MessageService) {

  }

  ngOnInit(): void {
    this.messageService.getDisplayMessages().subscribe((message: Message) => {
      console.log(message.text);
      this.snackBar.open(message.text, 'Hide', {
        duration: 3000
      });
    });
  }
}
