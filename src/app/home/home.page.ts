import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public prescriptions: any[];//= this.allPrescriptions();
  public time: string = Date();
  public areRxmindersMade: boolean;
  //public nextRxminder: string = this.getNextRxminder();

  constructor(private storage: Storage) {
    this.prescriptions = this.allPrescriptions();
    this.areRxmindersMade = true;
  }

  allPrescriptions(){
    let retVal = [];

    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>
    {
      retVal.push(value);
    });

    if(retVal==[])
    {
      this.areRxmindersMade = false;
    }

    return retVal;
  }


 /* getNextRxminder(){
    let nextRxminder = [];
    this.storage.forEach((value)=>{
      if((parseFloat(value.reminderTime) - parseFloat(this.time)) > 0 ){
        nextRxminder.push(value);
      }
    });
    return nextRxminder[0].reminderTime;
  }
  */
/*
  areRxmindersMade(){
    if(this.prescriptions.length == 0)
    {
      return false;
    }
    else{
      return true;
    }
  }
  */
}
