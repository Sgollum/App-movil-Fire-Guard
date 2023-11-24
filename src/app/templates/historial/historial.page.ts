import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  fireIncidents: any[] = []; 

  constructor(private firebaseService: FirebaseService,
              private router: Router) { }

  ngOnInit() {
    this.firebaseService.getFireIncidents().subscribe(data => {
      // Ordenar los incidentes por fecha y hora de manera descendente (del más nuevo al más antiguo)
      this.fireIncidents = data.sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }

  navigateToMap(lat: number, lng: number) {
    this.router.navigate(['/mapa'], { queryParams: { lat, lng } });
  }
}
