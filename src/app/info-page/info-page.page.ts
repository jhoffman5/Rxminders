import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.page.html',
  styleUrls: ['./info-page.page.scss'],
})
export class InfoPagePage implements OnInit {

  public prescription;
  public param;

  constructor(public navCtrl: NavController, private route: ActivatedRoute, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController, private iab: InAppBrowser) {
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
}
