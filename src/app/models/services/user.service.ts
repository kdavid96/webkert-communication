import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  private user: User
  userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  
  constructor(public afs: AngularFirestore) {}

  ngOnInit(){
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
  }

  getUsers(){
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.valueChanges();
    return this.users;
  }

  setUser(user: User){
    this.user = user
  }

  getUID(){
    return this.user.uid;
  }
}
