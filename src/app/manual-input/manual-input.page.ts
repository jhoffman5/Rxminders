import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.page.html',
  styleUrls: ['./manual-input.page.scss']
})
export class ManualInputPage implements OnInit {
  //preform: FormGroup;

  formData = {}

  constructor(){}

  ngOnInit() {
  }

  logForm(){
    console.log(this.formData);
    //this.http.post('localhost:43210', JSON.stringify(this.formData));
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
