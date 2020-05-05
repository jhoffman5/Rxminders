import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  public numMap;
  public numOfRxminders;
  public prescription;
  public param; 
  public formData = {preName:"", reminderTime:[], quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};

  constructor(public navCtrl: NavController, public toastController:ToastController, private route: ActivatedRoute, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, private iab: InAppBrowser) {
    this.param = this.route.snapshot.paramMap.get('preName').toString();
    this.formData = {preName:"", reminderTime:[], quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};
    this.prescription = this.formData;

    this.getPrescription().then((pre)=>{
      this.numOfRxminders = pre.reminderTime.length;
      this.prescription = pre;
      this.formData = pre;
      this.numMap = [];
      for(let i = 0; i < this.numOfRxminders; i++){
        this.numMap.push(i);
      }
      //this.prescription = pre;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getPrescription().then((pre)=>{
      this.numOfRxminders = pre.reminderTime.length;
      this.numMap = [];
      for(let i = 0; i < this.numOfRxminders; i++){
        this.numMap.push(i);
      }
      this.prescription = pre;
    });
  }

  async getPrescription():Promise<any>{
    return new Promise<any>((resolve)=>{
      this.storage.get(this.param).then(res=>{
        console.log("EDIT getPrescription:");
        console.log(res);
        resolve(res);
      });
    });
  }

  editForm(){
    this.storage.get(this.param)
      .then((res)=>{
        this.formData["countMissed"] = res.countMissed;
        this.formData["countCompleted"] = res.countCompleted;
        this.formData["status"] = res.status;

        //this.formData.reminderTime = this.formData.reminderTime;

        this.storage.remove(this.param)
          .then(()=>{
            this.storage.set(this.formData.preName,this.formData)
              .then(()=>{
                this.navCtrl.navigateForward("info-page/"+this.formData.preName);
              });
          });
      });
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

  cancelForm(){
    this.navCtrl.navigateForward("info-page/"+this.prescription.preName);
  }

  home(){
    this.navCtrl.navigateForward("home");
  }
}
