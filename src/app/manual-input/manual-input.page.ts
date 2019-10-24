import { Component, OnInit, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.page.html',
  styleUrls: ['./manual-input.page.scss']
})
export class ManualInputPage implements OnInit {
  formData = {preName:"", reminderTime:"", quantity: null}
  
  constructor(private storage: Storage){
  }

  ngOnInit() {
  }

  logForm(){
    console.log(this.formData);
    let formStuff = this.formData;

    this.storage.set(formStuff.preName,this.formData);

    this.storage.get(formStuff.preName).then((val)=>{
      console.log('Your next reminder is at', val.reminderTime);
    })
  }
/*
  addPrescription(){

    var postData = {
      name: "him",//this.name,
      time: "1:00",//this.time,
      quantity: "3"//this.quantity
    }

    this.httpClient.post<any>('http://localhost:43210/addPrescription', postData)
      .subscribe(
        (res)=>console.log(res),
        (error)=>console.log(error)
    );

  }
*/
}
