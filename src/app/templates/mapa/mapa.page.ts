import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
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
  dangerCircle: any; 
  fireMarker: any;
  orangeCircle: any;

  constructor(private interaction: InteractionService,
              private firebaseService: FirebaseService,
              private route: ActivatedRoute,
              private platform: Platform) {}

  ngOnInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
      this.setRandomDangerZone(); // Iniciar la generación de zonas de peligro aleatorias
    });
    this.route.queryParams.subscribe(params => {
      const lat = params['lat'];
      const lng = params['lng'];
  
      if (lat && lng) {
        this.navigateToLocation(lat, lng);
      }
    });
  }
//se muestra el mapa con la clave
  private loadGoogleMapsScript(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAqc_jaJjyy9FyhLGhxcChmJWNzUwXYfFY';
    script.async = true;
    script.defer = true;

    return new Promise((resolve, reject) => {
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
//se muestra el mapa
  private initMap() {
    const mapOptions = {
      center: new google.maps.LatLng(-33.6009271, -70.7088789),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
//genera los incendios en zonas random del mapa (intento de simulacion arduino)
  private setRandomDangerZone() {
    setInterval(() => {
      const lat = this.getRandomNumber(-56.0, -17.0);
      const lng = this.getRandomNumber(-75.0, -66.0);

      // Llama al método del servicio Firebase para guardar el incendio
      this.firebaseService.saveFireIncidentToFirestore(lat, lng);
  
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
    }, 60000); 
  }


  private getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

// este metodo es para mostrar en el mapa la ubicacion que se marco en el historial
  navigateToLocation(lat: number, lng: number) {
    const mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
  
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: this.map
    });
  
    setTimeout(() => {
      marker.setMap(null); // Elimina el marcador después de 10 segundos
    }, 10000);
  }

  callEmergency(number: string) {
    if (this.platform.is('cordova')) {
      window.open(`tel:${number}`, '_system');
    } else {
      console.warn('La función de llamada solo está disponible en dispositivos móviles.');
    }
  }
}
