import { Component, OnInit, ViewChild } from '@angular/core';

import { Storage } from '@ionic/storage';

import { ToastController } from '@ionic/angular';

import { Router } from '@angular/router';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-manual-input',
  templateUrl: './manual-input.page.html',
  styleUrls: ['./manual-input.page.scss']
})
export class ManualInputPage implements OnInit {
  formData = {preName:"", reminderTime: [], quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};
  public numOfRxminders;
  public numMap;

  constructor(public navCtrl: NavController, private storage: Storage, private router:Router, public toastController:ToastController){
    this.formData = {preName:"", reminderTime: [], quantity: null, dosage:"", notes:"", countCompleted: 0, countMissed: 0};
    this.numOfRxminders = 1;
    this.numMap = [];
    for(let i = 0; i < this.numOfRxminders; i++){
      this.numMap.push(i);
    }
  }

  ngOnInit() {
  }

  checkForm(): Promise<Object[]>{
    return new Promise((resolve)=>{
      this.storage.length()
        .then(num => {
          if(this.formData.preName==""){
            this.formData.preName = "Prescription "+num;
          }
          if(this.formData.reminderTime.length==0){
            this.formData.reminderTime = ["12:00"];
          }
          if(this.formData.dosage==""){
            this.formData.dosage="No Dosage Data";
          }
          if(this.formData.notes==""){
            this.formData.notes="No Notes";
          }
          resolve([num]);
        })
          .catch( err => {
            console.log(err.error);
          })
    });
  }

  logForm(){
    this.checkForm()
      .then((bool)=>{
        console.log("NAME HERE" +bool);
        console.log(this.formData);

        this.formData["status"] = "active";
        console.log(this.formData);
    
        this.storage.set(this.formData.preName,this.formData).then(()=>{
          this.alertMessage(this.formData.preName+" Added");
          this.router.navigateByUrl('/home');
        }).catch((e)=>{
          console.log(e);
          this.alertMessage('Failed Entering Prescription');
          this.router.navigateByUrl('/manual');
        });
      }).catch((e)=>{
        console.log(e);
        this.alertMessage('Failed Entering Prescription');
        this.router.navigateByUrl('/manual');
      })
  }

  async alertMessage(text: string)
  {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  public upNumMap()
  {
    this.numOfRxminders++;
    this.numMap = [];
    for(let i = 0; i < this.numOfRxminders; i++){
      this.numMap.push(i);
    }
  }

  public downNumMap()
  {
    this.numOfRxminders--;
    this.numMap = [];
    for(let i = 0; i < this.numOfRxminders; i++){
      this.numMap.push(i);
    }
  }

  home(){
    this.navCtrl.navigateForward("home");
  }

}
