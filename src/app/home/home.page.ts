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
  public nextRxminder: any;

  constructor(private storage: Storage) {
    this.areRxmindersMade = false;
    this.prescriptions = this.allPrescriptions();
    //this.nextRxminder = this.getNextRxminder();
    //this.storage.clear();
  }

  ionViewWillEnter() {
    this.prescriptions = this.allPrescriptions();
  }

  allPrescriptions(){
    let retVal = [];

    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
      retVal.push(value);
      this.areRxmindersMade = true;
    });

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
  /*async getNextRxminder(){
    //var prescriptions = await Promise.all(this.allPrescriptions());

    var next = new Date().getHours().toString() +":"+ new Date().getMinutes().toString();
    var currentTime = new Date().getHours().toString() +":"+ new Date().getMinutes().toString();
    //console.log(prescriptions.length);
    //this.allPrescriptions().then(prescriptions => console.log(prescriptions[0]));
    console.log("NEXT: "+next);

    return next;
  }*/

}
