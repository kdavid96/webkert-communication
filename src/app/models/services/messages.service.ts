import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable, OnInit } from '@angular/core';

import { ContactMessage } from '../interfaces/contact-message';
import { Message } from '../interfaces/message';
import { Observable } from 'rxjs';
import { Sender } from '../interfaces/sender';
import { compileInjector } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class MessagesService{

  private message: Message;
  private contactMessage: ContactMessage;
  messageCollection: AngularFirestoreCollection<Message>;
  contactMessageCollection: AngularFirestoreCollection<ContactMessage>;
  messages: Observable<Message[]>;
  contactMessages: Observable<ContactMessage[]>;
  successMsg: String = "Az üzenet elküldése sikeres!";
  tempId: string;
  
  constructor(public afs: AngularFirestore) {
    this.contactMessage = null;
  }
  
  getMessages(){
    this.messageCollection = this.afs.collection('messages');
    this.messages = this.messageCollection.valueChanges({idField: 'sajatid'});
    return this.messages;
  }

  setMessage(message: Message){
    this.message = message;
    this.tempId = this.afs.createId();
    this.message.id = this.tempId;
    this.afs.collection('messages').doc(this.tempId).set(this.message).then(_ => this.successMsg);
  }

  completeMessage(message: Message){
    this.message = message;
    this.afs.collection('messages').doc(this.message.id.toString()).update({status:"completed"}).then(_ => this.successMsg);
  }

  updateMessage(message: Message){
    this.message = message;
    this.afs.collection('messages').doc(this.message.id.toString()).update({status:message.status}).then(_ => this.successMsg);
  }

  deleteMessage(message: Message){
    this.message = message;
    this.afs.collection('messages').doc(this.message.id.toString()).delete().then(_ => this.successMsg);
  }

  sendMessage(s: Sender, recipient: String, subject: String, message: String){
    this.tempId = this.afs.createId();
    this.contactMessage = {sender: s, recipient: recipient, text: message, subject: subject, id: this.tempId, read: 'false'}
    this.afs.collection('contacts').doc(this.tempId).set(this.contactMessage).then(_ => this.successMsg);
  }

  getContactMessages(){
    this.contactMessageCollection = this.afs.collection('contacts');
    this.contactMessages = this.contactMessageCollection.valueChanges({idField: 'sajatid'});
    return this.contactMessages;
  }

  sendContactMessage(message: ContactMessage){
    this.tempId = this.afs.createId();
    message.id = this.tempId;
    this.afs.collection('contacts').doc(this.tempId).set(message).then(_ => this.successMsg);
  }

  readContactMessage(message: ContactMessage) {
    this.afs.collection('contacts').doc(message.id.toString()).update({read:'true'}).then(_ => this.successMsg);
  }

  deleteContactMessage(message: ContactMessage){
    this.afs.collection('contacts').doc(message.id.toString()).delete().then(_ => this.successMsg);
  }
}
