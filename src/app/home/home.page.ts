import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public prescriptions: any[];
  public time: string = Date();
  public areRxmindersMade: boolean = false;
  public nextRxminder: string;

  constructor(private storage: Storage) {
    this.areRxmindersMade = false;
    //this.prescriptions = 
    this.allPrescriptions();
    //this.nextRxminder = this.getNextRxminder();
    //this.storage.clear();
  }

  ionViewWillEnter() {
   // this.prescriptions = this.allPrescriptions();
   // this.nextRxminder = this.getNextRxminder();
   this.setPrescriptions().then( res => this.setNextRxminder() );
  }

  async setPrescriptions(){
    this.allPrescriptions();
  }

  setNextRxminder(){
    this.nextRxminder = this.getNextRxminder();
  }

  allPrescriptions(){
    let retVal = [];

    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
      retVal.push(value);
      this.areRxmindersMade = true;
    }).then(res=>{
      //console.log(retVal.length);
      this.prescriptions = retVal;
    });

   // console.log(retVal.length);

    return retVal;
    /*return new Promise((resolve,reject)=>{
      let retVal = [];

      this.storage.forEach((value:any, key:string, iterationNumber: Number)=>
      {
        retVal.push(value);
      });
  
      if(retVal==[])
      {
        this.areRxmindersMade = false;
      }

      resolve(retVal);
    });*/
  }

  devErase(){
    this.storage.clear();
  }
  getNextRxminder(){
    var prescriptions = []; 
    var next: string = "36:01"; // not a possible time
    var earliest: string = "36:01";
    var currentTime = new Date().getHours().toString() +":"+ ((new Date().getMinutes().toString().length<2) ? "0" + new Date().getMinutes().toString() : new Date().getMinutes().toString());
    //console.log("CURRENT TIME: "+currentTime);


    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
      prescriptions.push(value);
      this.areRxmindersMade = true;
    }).then( res => {

      prescriptions.forEach(element => {
        //console.log(element);
        if(element.reminderTime > currentTime && element.reminderTime < next)
        {
          next = element.reminderTime;
        }
        if(element.reminderTime < earliest)
        {
          earliest = element.reminderTime;
        }
      });

      if(next=="36:01")
      {
        next = earliest;
      }
      console.log("NEXT: "+next);
      this.nextRxminder = next;
    });

    return next;
  }

}
