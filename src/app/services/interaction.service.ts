import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  loading: any;

  constructor(private alertController: AlertController,
              public toastController: ToastController,
              public loadingController: LoadingController) { }

    async presentToast(mensaje: string){
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 2000
      });
      toast.present();
    }

    async presentLoading(mensaje:string){
      this.loading= await this.loadingController.create({
        cssClass:'my-custom-class',
        message: mensaje
      });
      await this.loading.present


    }

    async closeLoading(){
      await this.loading.dismiss();
    }


  async PresentAlert(texto:string, subtitulo:string){

    let aceptar = true

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: texto,
      subHeader: subtitulo,
      buttons: [{
        text: 'Cerrar',
        handler: () => {}
      }]
    });
      await alert.present();
      await alert.onDidDismiss();
      return aceptar;
    }
  }
