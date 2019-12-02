import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  neonSelected = null;
  neonList = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
       // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
       this.neonList = []
       this.getConfig().subscribe((res: Array<Object>) => {
         if(res) {
           res.forEach((command) => {
             this.neonList.push(command)
           })
         }
         console.log('User data after fetch : ', this.neonList);
       })
  }

  getConfig() {
    return this.http.get('http://localhost:5555');
  }


}
