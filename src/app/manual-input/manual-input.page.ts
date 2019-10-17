import { Component, OnInit, ViewChild } from '@angular/core';
//import { Http, Headers, RequestOptions } from '@angular/http';
//import { HTTP } from '@ionic-native/http/ngx';
//import { HttpModule } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.page.html',
  styleUrls: ['./manual-input.page.scss']
})
export class ManualInputPage implements OnInit {
  //preform: FormGroup;
  //http = new HttpClient('http//:localhost:43210/addPrescription');
  formData = {  };

  databaseObj: SQLiteObject; // Database instance object
  name_model:string = ""; // Input field model
  row_data: any = []; // Table rows
  readonly database_name:string = "Rxminders.db"; // DB name
  readonly table_name:string = "Prescriptions"; // Table name
 

  //http = new Http('http://127.0.0.1:43210/addPrescription',RequestOptions);
  constructor(private sqlite: SQLite){

  }

  ngOnInit() {
  }

  createDB(){
    this.sqlite.create({
      name:this.database_name,
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      this.databaseObj = db;
      alert('Database Created');
    })
    .catch(e => {
      alert("error "+JSON.stringify(e))
    });
  }

  createTable(){
    this.databaseObj.executeSql('CREATE TABLE IF NOT EXISTS ' + this.table_name + 'pid INTEGER PRIMARY KEY, Name text, Time text', [])
    .then(()=>{
      alert('Table Created');
    })
    .catch(e => {
      alert("error " + JSON.stringify(e))
    });
  }

  logForm(){

    console.log(this.formData);
    this.databaseObj.executeSql('INSERT INTO ' + this.table_name + ' VALUES ("' + 1 + "','" + 1 +'")"',[])//+ this.formData.preName + '","' + this.formData.time + '"', [])
    .then(()=>{
      alert('Row Inserted');
    })
    .catch(e=>{
      alert("error " + JSON.stringify(e))
    });
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
