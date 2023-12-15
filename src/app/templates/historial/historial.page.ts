import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Chart,registerables ,LinearScale, Title } from 'chart.js';

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
    this.generateChart();
  }

  navigateToMap(lat: number, lng: number) {
    this.router.navigate(['/mapa'], { queryParams: { lat, lng } });
  }

  generateChart() {
    Chart.register(LinearScale, Title, ...registerables);
  
    this.firebaseService.getFireIncidents().subscribe(data => {
      // Ordenar los incidentes por fecha y hora de manera descendente (del más nuevo al más antiguo)
      this.fireIncidents = data.sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB.getTime() - dateA.getTime();
      });
  
      const incidentDates = this.fireIncidents.map(incident => incident.fecha);
      const incidentsByDate = incidentDates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
  
      const chartData = {
        labels: Object.keys(incidentsByDate),
        datasets: [{
          label: 'Frecuencia de Incendios',
          data: Object.values(incidentsByDate),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        }]
      };
  
      const chartOptions = {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true
          }
        }
      };
      
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      const myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions as any // Puede ser necesario usar 'as any' debido a posibles discrepancias de tipado
      });
    });
  }
}
