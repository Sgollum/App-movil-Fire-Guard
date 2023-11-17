import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';

declare var google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  map: any;
  dangerCircle: any; // Variable para almacenar el círculo de peligro
  fireMarker: any;
  orangeCircle: any;

  constructor(private interaction: InteractionService) {}

  ngOnInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
      this.setRandomDangerZone(); // Iniciar la generación de zonas de peligro aleatorias
    });
  }

  private loadGoogleMapsScript(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAXWQjGCFqMyPOFX7qh1Nz3LUSec-PKHwc';
    script.async = true;
    script.defer = true;

    return new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(-33.6009271, -70.7088789),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  private setRandomDangerZone() {
    setInterval(() => {
      const lat = this.getRandomNumber(-56.0, -17.0);
      const lng = this.getRandomNumber(-75.0, -66.0);
  
      const dangerZoneCenter = new google.maps.LatLng(lat, lng);
  
      if (this.dangerCircle) {
        this.dangerCircle.setMap(null);
      }
  
      this.dangerCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.map,
        center: dangerZoneCenter,
        radius: 10000 // Radio en metros del círculo
      });
  
      const fireIcon = {
        url: 'assets/fuego.png',
        scaledSize: new google.maps.Size(10, 10),
      };
  
      if (this.fireMarker) {
        this.fireMarker.setMap(null); // Eliminar el marcador existente
      }
  
      this.fireMarker = new google.maps.Marker({
        position: dangerZoneCenter,
        map: this.map,
        icon: fireIcon,
      });
  
      if (this.orangeCircle) {
        this.orangeCircle.setMap(null); // Eliminar el círculo naranja existente
      }
  
      this.orangeCircle = new google.maps.Circle({
        strokeColor: '#FFA500',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFA500',
        fillOpacity: 0.35,
        map: this.map,
        center: dangerZoneCenter,
        radius: 20000 // Radio en metros del círculo naranja (mayor que el rojo)
      });
  
      const message = `Se generó un incendio en la ubicación: Latitud ${lat.toFixed(6)}, Longitud ${lng.toFixed(6)}`;
      this.interaction.PresentAlert('Alerta de incendio', message);
    }, 10000); // Ejecutar cada 10 segundos (10000 milisegundos)
  }

  private showAlert(message: string) {
    alert(message); // Muestra una alerta con el mensaje proporcionado
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
