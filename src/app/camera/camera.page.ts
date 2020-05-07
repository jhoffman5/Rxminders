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
  public times: any;
  public drugs: Set <string>;
  public prescription: string;
  public prescriptionsInImg: string[] = [];

  constructor(public navCtrl: NavController, private camera: Camera, private ocr: OCR, public file: File, public http: HTTP, public toastController: ToastController){ 
    this.notes = null;
    this.words = null;
    this.prescription = null;
    this.times = "no";
    this.takePicture();
  }

  ionViewDidEnter(){
    //this.takePicture();
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
        this.words = this.cleanText(recognizedText.words.wordtext);

        this.checkInFDAServer()
          .then(res => {
            this.prescription = res;
            this.notes = this.getNotes(recognizedText.blocks.blocktext);
            this.prescription = this.prescription[0].toUpperCase() + this.prescription.substr(1);
            alert(this.times);
            //alert(this.prescription);
            this.navCtrl.navigateForward('camera-form/'+this.prescription+"/"+this.notes);
          })
          .catch(rej => {
            console.log(rej);
            this.notes = this.getNotes(recognizedText.blocks.blocktext);
            alert('No prescription names found');
            this.navCtrl.navigateForward('camera-form/%20/'+this.notes);
          })
      }, (err) =>{
        alert('Error recognizing text: ' + err);
      })
    }, (err) => {
      alert("Camera issue:" + err)
      console.log("Camera issue:" + err);
    });
  }

  cleanText(words: string[]){
    for(var i = 0; i<words.length; i++)
    {
      words[i] = words[i].toLowerCase();
      if(words[i]=='\n'){
        words[i]=" ";
      }
    }
    return words
  }

  checkInFDAServer(): Promise<string> {
    return new Promise((resolve)=>{
      var word = "placeholder";

      this.words.forEach(element => {
        this.http.get('http://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json/?drugName='+element,{},{})
          .then(data => {
            if(JSON.stringify(JSON.parse(data.data).rxclassDrugInfoList) != undefined && element.length>2){
              word = element;
              resolve(element);
            }
        })
          .catch( err => {
            //alert("NO");
            //resolve(Promise.reject());
            console.log(err.status);
            console.log(err.error); // error message as string
            console.log(err.headers);
        })
      });
    })
  }
  
  getNotes(blockText: string[]){
    var notes: string = "";
    var rxNums: any;
    blockText = this.cleanText(blockText);
    blockText.forEach(element => {
      for(let i = 0; i < element.length-3; i++){
        if(((element[i]=='t'||element[i]=='T')&&(element[i+1]=='a'||element[i+1]=='A')&&(element[i+2]=='k'||element[i+2]=='K')&&(element[i+3]=='e'||element[i+3]=='E'))||((element[i]=='d'||element[i]=='D')&&(element[i+1]=='a'||element[i+1]=='A')&&(element[i+2]=='i'||element[i+2]=='I')&&(element[i+3]=='l'||element[i+3]=='L')&&(element[i+4]=='y'||element[i+4]=='Y'))){
          notes+=element;
          break;
        }
      }
    });

    let prevEl:any = null;
    blockText.forEach(element => {
      for(let i = 0; i < element.length-3; i++){
        if(((element[i]=='t'||element[i]=='T')&&(element[i+1]=='i'||element[i+1]=='I')&&(element[i+2]=='m'||element[i+2]=='M')&&(element[i+3]=='e'||element[i+3]=='E')&&(element[i+2]=='s'||element[i+2]=='S'))){
          rxNums = prevEl;
          break;
        }
        prevEl = element;
      }
    });

    this.notes = notes;
    this.times = rxNums;
    return notes;
  }

  home(){
    this.navCtrl.navigateForward("home");
  }

}
