import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public prescriptions: any[] = this.allPrescriptions();
  public time: string = Date();
  public h: string = this.time;
  constructor(private storage: Storage) {
    //this.prescriptions = this.allPrescriptions();
    //console.log(this.prescriptions);
  }

  allPrescriptions(){
    let retVal = [];
    
    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>
    {
      this.prescriptions.push(value);
    });

    return retVal;
  }


  areRxmindersMade(){
    if(this.prescriptions.length == 0)
    {
      return false;
    }
    else{
      return true;
    }
  }

}
