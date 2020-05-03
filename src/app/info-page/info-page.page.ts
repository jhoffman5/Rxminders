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
  selector: 'app-info-page',
  templateUrl: './info-page.page.html',
  styleUrls: ['./info-page.page.scss'],
})
export class InfoPagePage implements OnInit {

  public prescription;
  public param;

  constructor(public navCtrl: NavController, public toastController:ToastController, private route: ActivatedRoute, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, private iab: InAppBrowser) {
    this.param = this.route.snapshot.paramMap.get('preName').toString();
    console.log(this.param);
    this.updateInfo();
    //.then((data)=>{this.prescription=this.getPrescription(this.param)});
  }

  ngOnInit() {

  }

  async updateInfo(){
    this.prescription = this.getPrescription();
  }

  ionViewWillEnter() {
    this.updateInfo();
  }

  getPrescription(){
    var retVal = this.storage.get(this.param).then(res=>{
      this.prescription = res;
    });
    console.log(this.prescription);
    //this.prescription = retVal;
    return retVal;
  }

  search(term: String){
    const browser = this.iab.create('https://rxlist.com/search/rxl/'+term, '_system', 'location=yes');
  }

  async deletePopUp(preName: String){
    console.log(preName);

    const alert = await this.alertCtrl.create({
      header: 'Delete',
      subHeader: 'Delete '+preName+"?",
      buttons:[{
        text:'Confirm',
        role:'confirm',
        handler: ()=>{
          this.deletePrescription(preName);
          console.log('Delete Confirmed: '+preName);
          this.navCtrl.navigateForward("home");
        }
      }, {
        text: 'Cancel',
        role:'cancel',
        handler: ()=>{
          console.log('Delete Cancelled: '+preName);
        }
      }]
    });

    await alert.present();
  }

  deletePrescription(preName: String){
    this.storage.remove(preName.toString());
  }

  editPrescription(preName: String){
    console.log("EDIT: "+preName);
    this.navCtrl.navigateForward("edit/"+preName);
  }

  archivePrescription(preName: string){
    console.log("ARCHIVE: "+preName);
    this.storage.get(preName)
      .then(obj =>{
        obj["status"] = "archived";
        this.storage.set(preName, obj);
        this.alertMessage(preName+" Archived");
        this.home();
      });
  }

  activatePrescription(preName:string){
    console.log("ACTIVATE: "+preName);
    this.storage.get(preName)
      .then(obj =>{
        obj["status"] = "active";
        this.storage.set(preName, obj);
        this.alertMessage(preName+" Made Active");
        this.home();
      });
  }

  home(){
    this.navCtrl.navigateForward("home");
  }

  async alertMessage(text: string)
  {
    const toast = await this.toastController.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }
}
