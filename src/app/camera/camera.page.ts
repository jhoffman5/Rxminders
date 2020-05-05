import { Component, OnInit } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { OCR } from '@ionic-native/ocr/ngx'

import { File } from '@ionic-native/file/ngx';

import { HTTP } from '@ionic-native/http/ngx';

import { NavController } from '@ionic/angular';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss']
})
export class CameraPage implements OnInit {

  currentImage: any;
  public words: any;
  public notes: string;
  public drugs: Set <string>;
  public prescriptionsInImg: string[] = [];

  constructor(public navCtrl: NavController, private camera: Camera, private ocr: OCR, public file: File, public http: HTTP, public toastController: ToastController){ 

 }

  ionViewDidEnter(){
  }

  ngOnInit() {
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum:false,
      correctOrientation:true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = 'data:image/jpeg;base64,' + imageData;

      this.ocr.recText(4, /*3,*/ imageData)
      .then((recognizedText) => {
        console.log(recognizedText);
        alert(JSON.stringify(recognizedText));

        //this.words = recognizedText.words.wordtext;
        this.words = this.cleanText(recognizedText.words.wordtext);
        this.checkInFDAServer()
          .then(res => {
            this.words = res;
            this.notes = this.getNotes(recognizedText.blocks.blocktext);
          })
          .catch(rej => {
            console.log(rej);
            alert('No prescription names found')
          })
      }, (err) =>{
        alert('Error recognizing text: ' + err);
      })
    }, (err) => {
      alert("Camera issue:" + err)
      console.log("Camera issue:" + err);
    });
/*
    this.words = ["notap","asjkdfkla","ajlsdlnfkjabsdf","glycerin"];

    this.checkInFDAServer()
      .then(async res=>{
        console.log(`promise result: ${res}`);
        //send res and qty to form
        this.words = res;
      })
      .catch(rej=>{
        console.log(rej);
      }); */
  }

  cleanText(words: string[]){
    for(var i = 0; i<words.length; i++)
    {
      words[i] = words[i].toLowerCase();
      if(words[i]=="daily")
      {
        //get the previous 'number' and set 'var timesDaily' to that
      }

      if(words[i]=="qty"||words[i]=="qty:")
      {
        //set 'var qty' to words[i+1]
      }
    }
    return words
  }

  checkInFDAServer(): Promise<string> {
    return new Promise((resolve)=>{
      var word = "placeholder";
      console.log("...");

      this.words.forEach(element => {
        this.http.get('http://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json/?drugName='+element,{},{})
          .then(data => {
            if(JSON.stringify(JSON.parse(data.data).rxclassDrugInfoList) != undefined && element!="as"){
              word = element;
              resolve(element);
            }
        })
          .catch( err => {
            console.log(err.status);
            console.log(err.error); // error message as string
            console.log(err.headers);
        })
      });
    })
  }
  
  getNotes(blockText: string[]){
    var notes: string = "";
    blockText = this.cleanText(blockText);
    blockText.forEach(element => {
      for(let i = 0; i < element.length-3; i++){
        if((element[i]=='t'||element[i]=='T')&&(element[i+1]=='a'||element[i+1]=='A')&&(element[i+2]=='k'||element[i+2]=='k')&&(element[i+3]=='e'||element[i+3]=='e')){
          notes+=element;
        }
      }
    });
    return notes;
  }

  home(){
    this.navCtrl.navigateForward("home");
  }

}
