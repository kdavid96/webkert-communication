import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogContent } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/models/services/auth.service';
import { CommunicationService } from 'src/app/models/services/communication.service';
import { ContactMessage } from 'src/app/models/interfaces/contact-message';
import { MessagesService } from 'src/app/models/services/messages.service';
import { Router } from '@angular/router';
import { SendMessageComponent } from 'src/app/components/send-message/send-message.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages = new Array();
  userId: string;
  messagesObsIncoming$: Observable<ContactMessage[]>;
  messagesObsSent$: Observable<ContactMessage[]>;

  constructor(
    private router: Router,
    private authService: AuthService,
    public messagesService: MessagesService,
    private communicationService: CommunicationService,
    public matDialog: MatDialog,
    ) { }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/signin']);
    }
    this.communicationService.currentId.subscribe(id => this.userId = id);
    this.messagesObsIncoming$ = this.messagesService.getContactMessages().pipe(map(messages => messages.filter(msg => msg.recipient === this.userId)));
    this.messagesObsSent$ = this.messagesService.getContactMessages().pipe(map(messages => messages.filter(msg => msg.sender.id === this.userId)));

  }

  getMessages(){
    this.messagesObsSent$ = this.messagesService.getContactMessages();
    this.messagesObsIncoming$ = this.messagesService.getContactMessages();
  }

  check(message){
    this.messagesService.readContactMessage(message);
  }

  delete(message){
    this.messagesService.deleteContactMessage(message);
  }

  answer(message){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = {
      userId: this.userId,
      message: message
    }
    const modalDialog = this.matDialog.open(SendMessageComponent, dialogConfig);
  }
}
