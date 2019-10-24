import { Component } from '@angular/core';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  public prescriptions: string[] = this.allPrescriptions();

  constructor(private storage: Storage) {
    this.prescriptions = this.allPrescriptions();
    //console.log(this.prescriptions);
  }

  allPrescriptions(){
    let retVal = [];
    this.storage.keys()
    .then(
      data=>{
        retVal = data;
        this.prescriptions = data;
        //console.log(data);
        //return data;
      },
      error => console.log(error)
    );
    
    return retVal;
  }
}
