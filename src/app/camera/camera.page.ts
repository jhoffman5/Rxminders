import { Component, OnInit } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { OCR } from '@ionic-native/ocr/ngx'

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

  currentImage: any;
  public words: any;

  constructor(private camera: Camera, private ocr: OCR) { 
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

    //this.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true });
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
}
