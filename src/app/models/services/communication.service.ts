import { BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private idSource = new BehaviorSubject<string>(null);
  currentId = this.idSource.asObservable();
  
  constructor() { }

  changeId(id: string){
    this.idSource.next(id)
  }
}
