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

  public prescription;
  public param; 
  public formData = {preName:"", reminderTime:"", quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};

  constructor(public navCtrl: NavController, public toastController:ToastController, private route: ActivatedRoute, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, private iab: InAppBrowser) {
    this.param = this.route.snapshot.paramMap.get('preName').toString();
    this.formData = {preName:"", reminderTime:"", quantity: null, dosage:"", notes:"", countCompleted:0, countMissed:0};

    console.log(this.param);
    this.update();
  }

  ngOnInit() {
  }

  async update(){
    this.prescription = this.getPrescription();
  }

  ionViewWillEnter() {
    this.update();
  }

  getPrescription(){
    var retVal = this.storage.get(this.param).then(res=>{
      this.prescription = res;
    });
    return retVal;
  }

  editForm(){
    this.storage.get(this.param)
      .then((res)=>{
        this.formData["countMissed"] = res.countMissed;
        this.formData["countCompleted"] = res.countCompleted;
        this.formData["status"] = res.status;
        this.storage.remove(this.param)
          .then(()=>{
            this.storage.set(this.formData.preName,this.formData)
              .then(()=>{
                this.navCtrl.navigateForward("info-page/"+this.formData.preName);
              });
          });
      });
  }

  cancelForm(){
    this.navCtrl.navigateForward("info-page/"+this.prescription.preName);
  }

  home(){
    this.navCtrl.navigateForward("home");
  }
}
