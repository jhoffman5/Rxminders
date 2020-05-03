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


  constructor(public navCtrl: NavController, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController) {
    this.areRxmindersMade = false;
    this.countActive = 0;
    this.countArchived = 0;
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
        retVal.push(value);
        this.areRxmindersMade = true;
        if(value.status=='active'){
          this.countActive++;
        } else if(value.status=='archived'){
          this.countArchived++;
        }
      })
        .then(res=>{
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
          resolve(next);
        });
      } else {
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
      this.prescriptions.forEach(element => {
        if(element.reminderTime == this.nextRxminder && element.status =='active'){
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
        });
        console.log("RXMINDER TIME: "+twelveHRString);
        console.log("RXMINDER TEXT: "+prescriptionText);
      }
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
          this.delete(preName);
          this.getAllPrescriptions().then( (pres) => {
            this.prescriptions = pres;
            this.getRxminder().then( (rxminder) =>{
              this.nextRxminder = rxminder;
              this.scheduleNotification();
            });
          });
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

  public toggleDelete()
  {
    if(this.archiveToggle.isCheck != true){
      this.deleteToggle.isCheck = !this.deleteToggle.isCheck;
    }
  }

  public toggleArchive()
  {
    //if(this.deleteToggle.isCheck != true){
    //  this.archiveToggle.isCheck = !this.archiveToggle.isCheck;
    //}
    console.log(this.archiveToggle.isCheck);
  }

  public delete(prescription: String)
  {
    this.storage.remove(prescription.toString());
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


