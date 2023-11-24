import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { InteractionService } from './interaction.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore,
              private interaction: InteractionService) { }
//para guardar los incendios en firebase
  async saveFireIncidentToFirestore(lat: number, lng: number) {
    const collectionRef = this.firestore.collection('incendios');
    const newIncidentRef = collectionRef.doc();

    const now = new Date();
    const incidentData = {
      lugar: { latitude: lat, longitude: lng },
      fecha: now.toISOString().split('T')[0],
      hora: now.toTimeString().split(' ')[0],
    };

    try {
      await newIncidentRef.set(incidentData);
      this.interaction.presentToast("Incendio guardado en el historial.")
      console.log('Incidente de incendio agregado a la base de datos.');
    } catch (error) {
      this.interaction.presentToast("Error al guardar incendio.")
      console.error('Error al guardar en Firebase:', error);
    }
  }
//para mostrar los incendios
  getFireIncidents(): Observable<any[]> {
    return this.firestore.collection('incendios').valueChanges();
  }
}
