import { Component, OnInit } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { OCR } from '@ionic-native/ocr/ngx'

import { File } from '@ionic-native/file/ngx';

import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss']
})
export class CameraPage implements OnInit {

  currentImage: any;
  public words: any;
  public drugs: Set <string>;
  public prescriptionsInImg: string[] = [];

  constructor(private camera: Camera, private ocr: OCR, public file: File, public http: HTTP){//, private rx: RxclassApi) { 

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
        this.cleanText(recognizedText.words.wordtext);
      }, (err) =>{
        alert('Error recognizing text: ' + err);
      })
    }, (err) => {
      alert("Camera issue:" + err)
      console.log("Camera issue:" + err);
    });

    //this.words = ["notap","asjkdfkla","ajlsdlnfkjabsdf","glycerin"];

    this.checkInFDAServer()
      .then(res=>{
        console.log(`promise result: ${res}`);
        //send res and qty to form
        this.words = res;
      })
      .catch(rej=>{
        console.log(rej);
      });
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
    this.words = words;
  }

  checkInFDAServer(): Promise<string> {
    return new Promise((resolve)=>{
      var word = "placeholder";
      console.log("...");

      this.words.forEach(element => {
        this.http.get('http://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json/?drugName='+element,{},{})
          .then(data => {
            if(JSON.stringify(JSON.parse(data.data).rxclassDrugInfoList) != undefined){
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
}
