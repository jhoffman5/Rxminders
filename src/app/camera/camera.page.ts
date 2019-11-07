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
        alert(recognizedText);
        this.words = recognizedText.words;
      }, (err) =>{
        alert('Failed because: ' + err);
      })
    }, (err) => {
      console.log("Camera issue:" + err);
    });

    //this.camera.getPicture(onSuccess, onFail, { quality: 100, correctOrientation: true });
  }

  recognizeText(){
    console.log(this.currentImage);
    alert(this.currentImage);
  }
}
