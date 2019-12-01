
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-neon-list',
  templateUrl: './neon-list.component.html',
  styleUrls: ['./neon-list.component.scss']
})
export class NeonListComponent implements OnInit {

  constructor() { }
  neonSelected = null;
  ngOnInit() {
  }

  goToNeonDetail(neonPayload) {
    console.log('the neon to see: ', neonPayload);
    if(neonPayload['id']) {
      this.neonSelected = neonPayload
    }

  }

}
