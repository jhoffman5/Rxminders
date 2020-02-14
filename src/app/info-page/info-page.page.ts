import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AlertController } from  '@ionic/angular';

import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.page.html',
  styleUrls: ['./info-page.page.scss'],
})
export class InfoPagePage implements OnInit {

  public prescription;
  public param;

  constructor(public navCtrl: NavController, private route: ActivatedRoute, private storage: Storage, private localNotifications: LocalNotifications, private plt: Platform, private alertCtrl: AlertController) {
    this.param = this.route.snapshot.paramMap.get('preName').toString();
    console.log(this.param);
    this.getPrescription(this.param);
    //.then((data)=>{this.prescription=this.getPrescription(this.param)});
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    
  }

  getPrescription(preName){
    this.storage.get(preName);
    console.log(this.prescription);
  }
}
