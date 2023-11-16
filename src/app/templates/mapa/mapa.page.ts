import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  map: any;

  ngOnInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
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
}
