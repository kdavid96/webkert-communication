import { compileNgModule } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Status } from 'src/app/models/enum/status.enum';
import { ContactMessage } from 'src/app/models/interfaces/contact-message';
import { Message } from 'src/app/models/interfaces/message';
import { Sender } from 'src/app/models/interfaces/sender';
import { AuthService } from 'src/app/models/services/auth.service';
import { CommunicationService } from 'src/app/models/services/communication.service';
import { MessagesService } from 'src/app/models/services/messages.service';
import { UserService } from 'src/app/models/services/user.service';
import { DialogAddComponent } from '../dialog-add/dialog-add.component';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit {

  addReplyForm: FormGroup;
  userArray = new Array();
  name: string;
  userId: string;
  msg: ContactMessage;
  sender: Sender;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private dialogRef: MatDialogRef<DialogAddComponent>,
    private toastr: ToastrService,
    private messagesService: MessagesService,
    private communicationService: CommunicationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      this.addReplyForm = this.formBuilder.group({
        text: [null, Validators.required],
        id: [null, Validators.required]
      });
      this.userId = data.userId;
      this.msg = data.message;
      this.communicationService.changeId(data.userId);
      this.userArray = [];
      this.userService.getUsers().subscribe(items => {
        if(this.authService.authState){
          for (let i = 0; i < items.length; i++){
            if(items[i].uid !== this.userId){
              this.userArray.push({uid: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName});
            }else{
              this.sender = {id: items[i].uid, firstName: items[i].firstName, lastName: items[i].lastName};
            }
          }
        }
      });
    }

  ngOnInit(): void {
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/signin']);
    }
  }

  ngOnDestroy(): void {
    console.log("Destroyed");
  }

  submit() {
    for(let i = 0; i < this.userArray.length; i++){
      if(this.userArray[i].uid == this.userId){
        this.sender = this.userArray[i];
      }
    }
    this.msg = {
      sender: this.sender,
      recipient: this.msg.sender.id,
      text: this.addReplyForm.value.text,
      subject: this.msg.subject,
      read: "false",
      id: "0"
    }
    console.log(this.msg);
    if(this.msg.sender !== null && this.msg.recipient !== null && this.msg.text !== null && this.msg.subject !== null && this.msg.read !== null && this.msg.id !== null){
      this.messagesService.sendContactMessage(this.msg);
      this.addReplyForm.reset();
      for (let name in this.addReplyForm.controls) {
        this.addReplyForm.controls[name].setErrors(null);
      }
      this.toastr.success("Az üzenet elküldése sikeres!", "Siker!", { positionClass: 'toast-top-center' });
    }else{
      this.toastr.error("Az összes mező kitöltése kötelező!", "Hiba!", { positionClass: 'toast-top-center' });
    }
    
  }

  listUsers(){
    return this.userArray;
  }

}
