import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public prescriptions: any[];
  public time: string = Date();
  public areRxmindersMade: boolean = false;
  public nextRxminder: string;

  constructor(public navCtrl: NavController, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController) {
    this.areRxmindersMade = false;
    this.allPrescriptions();

    /*this.localNotifications.on('click', (notification, state) => {
      let json = JSON.parse(notification.data);

      let alert = this.alertCtrl.create({
        title: notification.title,
        subTitle: json.myData
      });
      alert.present();
    });*/
  }

  ionViewWillEnter() {
   this.setPrescriptions().then( res => this.setNextRxminder() );
   this.scheduleNotification()
  }

  ionViewDidEnter() {
    //this.localNotifications.cancelAll(); // clear past notifications
    this.setPrescriptions().then( res => this.setNextRxminder() ); // set new notification
    this.scheduleNotification();
  }

  async setPrescriptions(){
    this.allPrescriptions();
  }

  setNextRxminder(){
    this.nextRxminder = this.getNextRxminder();
  }

  allPrescriptions(){
    let retVal = [];

    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
      retVal.push(value);
      this.areRxmindersMade = true;
    }).then(res=>{
      this.prescriptions = retVal;
    });

    return retVal;
  }

  devErase(){
    this.storage.clear();
  }

  getNextRxminder(){
    var prescriptions = []; 
    var next: string = "36:01"; // not a possible time
    var earliest: string = "36:01";
    var currentTime = new Date().getHours().toString() +":"+ ((new Date().getMinutes().toString().length<2) ? "0" + new Date().getMinutes().toString() : new Date().getMinutes().toString());
    //console.log("CURRENT TIME: "+currentTime);


    this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
      prescriptions.push(value);
      this.areRxmindersMade = true;
    }).then( res => {
      prescriptions.forEach(element => {
        //console.log(element);
        if(element.reminderTime > currentTime && element.reminderTime < next)
        {
          next = element.reminderTime;
        }
        if(element.reminderTime < earliest)
        {
          earliest = element.reminderTime;
        }
      });

      if(next=="36:01")
      {
        next = earliest;
      }
      console.log("NEXT: "+next);
      this.nextRxminder = next;
    });

    return next;
  }

  scheduleNotification(){

    var twelveHRTime = parseInt(this.nextRxminder[0]) * 10 + parseInt(this.nextRxminder[1]);
    //alert(twelveHRTime);

    var reminderHour = twelveHRTime;
    var reminderMinute = this.nextRxminder[3].toString()+this.nextRxminder[4].toString();

    var AMorPM = ((twelveHRTime < 12) ? 'AM' : 'PM');
    twelveHRTime = twelveHRTime % 12;
    twelveHRTime = (twelveHRTime == 0) ? 12 : twelveHRTime; 

    var twelveHRString = twelveHRTime.toString()+':'+this.nextRxminder[3]+this.nextRxminder[4]+' '+AMorPM;

    var preList = '';
    this.prescriptions.forEach(element => {
      if(element.reminderTime == this.nextRxminder){
        preList += element.preName + ", ";  //add dosages
      }  
    });

    preList = preList.slice(0,preList.length-2); //erase last comma

    let prescriptionText = 'Time to take: ' + preList;

    this.localNotifications.schedule({
      id: 1,
      title: 'It\'s '+twelveHRString+'!',
      trigger: {every: {hour:reminderHour, minute: parseInt(reminderMinute)}, count:1},//{ at: new Date(new Date().getTime() + 3600) },
      data: { myData: 'hidden Message' },
      icon: 'src//assets//icon//bottle.png',
      actions: [
        { id: 'taken', title: 'Confirm' },
        { id: 'missed',  title: 'Skip' }
      ],
      text: prescriptionText
      //sound: this.plt.is('android')? 'file://sound.mp3': 'file://beep.caf'
      })

  }

  public infoPage(prescription)
  {
    this.navCtrl.navigateForward("info-page/"+prescription.preName);
  }

}


