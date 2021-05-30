import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/models/services/auth.service';
import { CommunicationService } from 'src/app/models/services/communication.service';
import { MessagesService } from '../../models/services/messages.service';
import { Router } from '@angular/router';
import { Sender } from 'src/app/models/interfaces/sender';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/models/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  messageForm: FormGroup;
  subject: string;
  message: string;
  userArray = new Array();
  userId: string;
  contactMessages = new Array();
  sender: Sender;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessagesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private userService: UserService,
    private communicationService: CommunicationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/signin']);
    }
    this.messageForm = this.formBuilder.group({
      subject: [null, Validators.required],
      recipient: [null, Validators.required],
      message: [null, Validators.required]
    }),
    this.communicationService.currentId.subscribe(id => this.userId = id);
    this.userArray = [];
    this.userService.getUsers().subscribe(items => {
      if(this.authService.authState){
        for (let i = 0; i < items.length; i++){
          if(items[i].uid !== this.userId){
            this.userArray.push({uid: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName});
          }
        }
        for (let i = 0; i < items.length; i++){
          if(items[i].uid === this.userId){
            this.sender = {id: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName};
          }
        }
      }
    });
  }

  async submit(){
    if (this.messageForm.valid){
      try{
        const res = await this.messageService.sendMessage(this.sender, this.messageForm.value.recipient, this.messageForm.value.subject, this.messageForm.value.message);
      }catch(e){
        this.toastr.error(e, "Hiba történt component:", { positionClass: 'toast-top-center' });
        return;
      }
      this.messageForm.reset();
      for (let name in this.messageForm.controls) {
        this.messageForm.controls[name].setErrors(null);
      }
      this.toastr.success("Sikeres küldés!", "Siker!", { positionClass: 'toast-top-center' });
    }
  }

  listUsers(){
    return this.userArray;
  }

  listMessages(){
    /*this.messageService.getContactMessages().subscribe(items => {
      this.contactMessages = [];
      var localRecipient = "cimzett";
      var localSender = "felado";
      for(let i = 0; i < items.length; i++){
        if(items[i].recipient !== null && items[i].recipient.toString() == this.userId){
          for(let g = 0; g < this.userArray.length; g++){
            if(this.userArray[g].uid == items[i].recipient.toString()){
              localRecipient = this.userArray[g].firstName + " " + this.userArray[g].lastName;
            }
            if(this.userArray[g].uid == items[i].sender.id.toString()){
              localSender = this.userArray[g].firstName + " " + this.userArray[g].lastName;
            }
          }
          this.contactMessages.push({sender: localSender, recipient: localRecipient, content: items[i].text, subject: items[i].subject, id: items[i].id});
        }
      }
    });
    return this.contactMessages;*/
    return [];
  }
}
