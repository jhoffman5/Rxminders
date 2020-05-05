import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { ToastController } from '@ionic/angular';

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
  public areRxmindersMade: boolean;
  public nextRxminder: string;
  public countActive: number;
  public countArchived: number;
  public deleteToggle = {
    val: 'Toggle Delete', isCheck:false
  }

  public archiveToggle = {
    val: 'Toggle Archive', isCheck:false
  }

  public lastNotificationClick: Date;


  constructor(public navCtrl: NavController, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, public toastController:ToastController) {
    this.deleteToggle = {
      val:'Toggle Delete', isCheck: false
    };
    this.archiveToggle = {
      val: 'Toggle Archive', isCheck:false
    };

    this.lastNotificationClick = new Date(0);

    this.getAllPrescriptions().then( (pres) => {
      this.prescriptions = pres;
      this.getRxminder().then( (rxminder) =>{
        this.nextRxminder = rxminder;
        this.scheduleNotification();
      });
    });
  }

  public ionViewWillEnter() {
    this.deleteToggle = {
      val:'Toggle Delete', isCheck: false
    };
    this.archiveToggle = {
      val: 'Toggle Archive', isCheck:false
    };

    this.getAllPrescriptions().then( (pres) => {
      this.prescriptions = pres;
      this.getRxminder().then( (rxminder) =>{
        this.nextRxminder = rxminder;
        this.scheduleNotification();
      });
    });
  }


  public getAllPrescriptions(): Promise<Object[]>{
    return new Promise((resolve) => {
      let retVal = [];
      this.areRxmindersMade = false;
      this.countActive = 0;
      this.countArchived = 0;

      this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
        this.getPrescriptionsNextRxminder(value.preName).then((pre:any)=>{
          retVal.push(pre);
          this.areRxmindersMade = true;
          if(pre.status=='active'){
            this.countActive++;
          } else if(pre.status=='archived'){
            this.countArchived++;
          }
        });
      }).then(res=>{
          this.prescriptions = retVal;
          resolve(retVal);
        })
        .catch(e=>{
          console.log(e);
        });
    })
  }

  public getRxminder(): Promise<string>{
    return new Promise((resolve) => {
      var prescriptions = []; 
      var next: string = "36:01"; // not a possible time
      var earliest: string = "36:01";
      var currentTime = new Date().getHours().toString() +":"+ ((new Date().getMinutes().toString().length<2) ? "0" + new Date().getMinutes().toString() : new Date().getMinutes().toString());

      if(this.countActive!=0){
        this.storage.forEach((value:any, key:string, iterationNumber: Number)=>{
          if(value["status"]=="active"){
            prescriptions.push(value);
          }
          this.areRxmindersMade = true;
        }).then( res => {
          prescriptions.forEach(element => {
            element.reminderTime.forEach(rxminder => {
              if(rxminder > currentTime && rxminder < next)
              {
                next = rxminder;
              }
              if(rxminder < earliest)
              {
                earliest = rxminder;
              }
            });
          });

          if(next=="36:01")
          {
            next = earliest;
          }
          console.log("NEXT: "+next);
          resolve(next);
        });
      } else {
        console.log("NEXT: No Rxminder Set");
        resolve("No Rxminder Set");
      }
    })
  }

  public scheduleNotification(){
    if(this.countActive!=0){
      var twelveHRTime = parseInt(this.nextRxminder[0]) * 10 + parseInt(this.nextRxminder[1]);

      var reminderHour = twelveHRTime;
      var reminderMinute = this.nextRxminder[3].toString()+this.nextRxminder[4].toString();

      var AMorPM = ((twelveHRTime < 12) ? 'AM' : 'PM');
      twelveHRTime = twelveHRTime % 12;
      twelveHRTime = (twelveHRTime == 0) ? 12 : twelveHRTime; 

      var twelveHRString = twelveHRTime.toString()+':'+this.nextRxminder[3]+this.nextRxminder[4]+' '+AMorPM;

      var preList = '';
      var notificationList = [];
      this.prescriptions.forEach(element => {
        if(element.reminderTime == this.nextRxminder && element.status =='active'){
          preList += element.preName + ", ";  //add dosages
          notificationList += element;
        }  
      });

      preList = preList.slice(0,preList.length-2); //erase last comma

      let prescriptionText = 'Time to take: ' + preList;
      let notification = {
        id: 1,
        title: 'It\'s '+twelveHRString+'!',
        trigger: /*{every: {hour:reminderHour, minute: parseInt(reminderMinute)}, count:1},*/{ at: new Date(new Date().getTime() + 3600) },
        data: { myData: 'hidden Message', notList: notificationList },
        actions: [
          { id: 'taken', title: 'Confirm', launch: true },
          { id: 'missed',  title: 'Skip', launch: true }
        ],
        text: prescriptionText
        //sound: this.plt.is('android')? 'file://sound.mp3': 'file://beep.caf'
      };

      this.localNotifications.on('click').subscribe(async ()=>{
        const toast = await this.toastController.create({
          message: "CLICK",
          duration: 3000
        });
        toast.present();
      });

      this.localNotifications.on('missed').subscribe(async notification => {
        this.localNotifications.clearAll();
        this.prescriptions.forEach(element => {
          if(element.reminderTime == this.nextRxminder && element.status =='active' && (new Date().getTime() - this.lastNotificationClick.getTime()) > 1000 ){

            this.storage.get(element.preName)
              .then((res)=>{
                res.countMissed = res.countMissed+1;

                this.storage.remove(element.preName)
                  .then(()=>{
                    this.storage.set(res.preName,res)
                  });
            });
          }
        });
      });

      this.localNotifications.on('taken').subscribe(async notification => {
        this.localNotifications.clearAll();
        this.prescriptions.forEach(element => {
          if(element.reminderTime == this.nextRxminder && element.status =='active' && (new Date().getTime() - this.lastNotificationClick.getTime()) > 1000 ){

            this.storage.get(element.preName)
              .then((res)=>{
                res.countCompleted = res.countCompleted +1;

                this.storage.remove(element.preName)
                  .then(()=>{
                    this.storage.set(res.preName,res)
                  });
            });
          }
        });
      });

      this.localNotifications.cancelAll().then(()=>{
        this.localNotifications.schedule(notification);
        console.log("RXMINDER TIME: "+twelveHRString);
        console.log("RXMINDER TEXT: "+prescriptionText);
      });
    }
  }

  public async addMissed(preName: string)
  {
    this.storage.get(preName).then(prescription=>{
      prescription.countMissed = prescription.countMissed+1;
      this.storage.set(preName,prescription);
    })
  }

  async deletePopUp(preName: string){
    console.log(preName);

    const alert = await this.alertCtrl.create({
      header: 'Delete',
      subHeader: 'Delete '+preName+"?",
      buttons:[{
        text:'Confirm',
        role:'confirm',
        handler: ()=>{
          this.delete(preName);
        }
      }, {
        text: 'Cancel',
        role:'cancel',
        handler: ()=>{
          console.log('Delete Canceled: '+preName);
        }
      }]
    });

    await alert.present();
  }

  async archivePopUp(preName: string)
  {
    console.log(preName);

    const alert = await this.alertCtrl.create({
      header: 'Archive',
      subHeader: 'Archive '+preName+"?",
      buttons:[{
        text:'Confirm',
        role:'confirm',
        handler: ()=>{
          this.archive(preName);
        }
      }, {
        text: 'Cancel',
        role:'cancel',
        handler: ()=>{
          console.log('Archive Canceled: '+preName);
        }
      }]
    });

    await alert.present();
  }

  async renewPopUp(prescription: string)
  {
    console.log(prescription);

    const alert = await this.alertCtrl.create({
      header: 'Renew',
      subHeader: 'Renew '+prescription+"?",
      buttons:[{
        text:'Confirm',
        role:'confirm',
        handler: ()=>{
          this.activate(prescription);
        }
      }, {
        text: 'Cancel',
        role:'cancel',
        handler: ()=>{
          console.log('Archive Canceled: '+prescription);
        }
      }]
    });

    await alert.present();
  }

  public delete(prescription: string)
  {
    this.storage.remove(prescription)
      .then(()=>{
        this.getAllPrescriptions().then( (pres) => {
          this.prescriptions = pres;
          this.getRxminder().then( (rxminder) =>{
            this.nextRxminder = rxminder;
            this.scheduleNotification();
          });
        });
      });
  }

  public archive(prescription: string)
  {
    this.storage.get(prescription)
      .then(obj =>{
        obj["status"] = "archived";
        this.storage.set(prescription, obj)
          .then(()=>{
            this.getAllPrescriptions().then( (pres) => {
              this.prescriptions = pres;
              this.getRxminder().then( (rxminder) =>{
                this.nextRxminder = rxminder;
                this.scheduleNotification();
              });
            });
        });
    });
  }

  public activate(prescription: string)
  {
    this.storage.get(prescription)
      .then(obj =>{
        obj["status"] = "active";
        this.storage.set(prescription, obj)
          .then(()=>{
            this.getAllPrescriptions().then( (pres) => {
              this.prescriptions = pres;
              this.getRxminder().then( (rxminder) =>{
                this.nextRxminder = rxminder;
                this.scheduleNotification();
              });
            });
          });
      });
  }

  public async getPrescriptionsNextRxminder(preName:string): Promise<Object>
  {
    return new Promise<Object>((resolve)=>{
      var next: string = "36:01"; // not a possible time
      var earliest: string = "36:01";
      var currentTime = new Date().getHours().toString() +":"+ ((new Date().getMinutes().toString().length<2) ? "0" + new Date().getMinutes().toString() : new Date().getMinutes().toString());
  
      this.storage.get(preName)
        .then(prescription=>{
          for (let index = 0; index < prescription["reminderTime"].length; index++) {
            if(prescription["reminderTime"][index] > currentTime && prescription["reminderTime"][index] < next)
            {
              next = prescription["reminderTime"][index];
            }
            if(prescription["reminderTime"][index] < earliest)
            {
              earliest = prescription["reminderTime"][index];
            }
          }
          if(next == "36:01")
          {
            next = earliest;
          }
          console.log(prescription.preName+" "+next);
          prescription["next"] = next;
          resolve(prescription);
      });
    });
  }

  public chooseInputPage()
  {
    this.navCtrl.navigateForward("choose-input");
  }

  public infoPage(prescription)
  {
    this.navCtrl.navigateForward("info-page/"+prescription.preName);
  }
  
  public home(){
    this.navCtrl.navigateForward("home");
  }

}


