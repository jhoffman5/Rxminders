import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-choose-input',
  templateUrl: './choose-input.page.html',
  styleUrls: ['./choose-input.page.scss'],
})
export class ChooseInputPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  
  home(){
    this.navCtrl.navigateForward("home");
  }

}
