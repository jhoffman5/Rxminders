import { Component, OnInit, ViewChild } from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
//import { HttpModule } from '@angular/http';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.page.html',
  styleUrls: ['./manual-input.page.scss']
})
export class ManualInputPage implements OnInit {
  //preform: FormGroup;
  //http = new HttpClient('http//:localhost:43210/addPrescription');
  formData = {  }
  //http = new Http('http://127.0.0.1:43210/addPrescription',RequestOptions);
  constructor(private http: HTTP){
  }

  ngOnInit() {
  }

  logForm(){
    console.log(this.formData);
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
