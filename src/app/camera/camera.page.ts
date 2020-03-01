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
  public prescriptionsInImg: string[];

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

    this.words = ["adderall","notaprescription"];

    this.words.forEach(element => {
      console.log(element)
      if(this.checkInFDAServer(element))
      {
        this.prescriptionsInImg.push(element);
      }
    });
    //this.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true });
    console.log("PRESCRIPTIONS: "+this.prescriptionsInImg);
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

  async checkInFDAServer(word:string): Promise<boolean> {

    var retVal: boolean = false;

    this.http.get('http://rxnav.nlm.nih.gov/REST/rxclass/class/byDrugName.json/?drugName='+word,{},{})
    .then(data => {
      console.log(word);
      console.log(JSON.stringify("DRUG: "+data.data));
      retVal = true;
      return retVal;
    })
    .catch( err => {
      console.log(err.status);
      console.log(err.error); // error message as string
      console.log(err.headers);
      retVal = false;
      return retVal;
    })

    return retVal;
  }
}
