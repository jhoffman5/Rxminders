import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { ToastController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-camera-form',
  templateUrl: './camera-form.page.html',
  styleUrls: ['./camera-form.page.scss'],
})
export class CameraFormPage implements OnInit {
  formData = {preName:"", reminderTime: [], quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};
  public numOfRxminders;
  public numMap;

  constructor(public navCtrl: NavController, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, public toastController:ToastController) {
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
          var r = [];
          this.formData.reminderTime.forEach(time=>{
            if(time !=""){
              r.push(time);
            }
          })
          this.formData.reminderTime = r;

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
          this.navCtrl.navigateForward('home');
        }).catch((e)=>{
          console.log(e);
          this.alertMessage('Failed Entering Prescription');
          this.navCtrl.navigateForward('camera-form');
        });
      }).catch((e)=>{
        console.log(e);
        this.alertMessage('Failed Entering Prescription');
        this.navCtrl.navigateForward('camera-form');
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
