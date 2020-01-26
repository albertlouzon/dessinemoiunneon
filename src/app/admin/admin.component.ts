import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { currentView } from '../app.component';
import {ExcelService} from '../services/excel.service';
import {MatDialog} from '@angular/material';
import {ModalComponent} from '../modal/modal.component';
import {ModalRecapComponent} from '../modal-recap/modal-recap.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  neonSelected = 'none';
  neonList = [];
  cachedList = [];
  constructor(private http: HttpClient, private excelService: ExcelService, public dialog: MatDialog) { }
  loading = false;
  commandPrice = 0;
  currentFile;
  pollInterval;
  numOfCommands = 0;
  numOfCreated = 0;
  numOfDT = 0;
  numOfPayes = 0;
  currentFilter = 'tous-les-neons';
  excelData: Array<{nom: string, prenom: string, type: 'business' | 'consumer', email: string, couleur: string, etat: string, prix: string, typo: string }> = [];
  ngOnInit() {
this.fetchCommands();
this.pollInterval = setInterval(() => {
  this.fetchCommands();
}, 80000);
  }

  ngOnDestroy() {
    clearInterval(this.pollInterval);
  }
  goToDetail(command) {
    this.neonSelected = command;
    this.commandPrice = 0;
    console.log('command selected by admin : ', command);
  }
  getConversionRate() {
    let treated = 0;
    let payed = 0;
    let total = 0;
    this.cachedList.forEach((neon) => {
      if (neon['state'] === 'payé') {
        payed++;
        total++;
      } else if (neon['state'] === 'Prêt') {
        treated++;
        total++;
      }
    });
    if (total === 0) {
      total = 1;
    }
    console.log('hahaha', payed, total );
    return payed / total * 100;

  }

  relancer(command)  {
    console.log('envoyer api avec payload : ', command);
    this.http.post('https://neon-server.herokuapp.com/relance', command, ).subscribe((url) => {
      console.log('sucess URL:', url);
      return url;
    }, err => {
      if (err['status'] === 200) {
        console.log('sucess but 200 error :', err);

      }
    });
  }
  openStats() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {conversionRate: this.getConversionRate()}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  filterCommand(type) {
    console.log(type);
    if (type === 'En cours de design') {
      this.neonList = this.cachedList.filter(c => c.state === 'En cours de design');
      this.currentFilter = type;
    } else  if (type === 'Prêt') {
      this.neonList = this.cachedList.filter(c => c.state === 'Prêt');
      this.currentFilter = type;
    } else  if (type === 'Payé') {
      this.neonList = this.cachedList.filter(c => c.state === 'payé');
      this.currentFilter = type;
    } else  if (type === 'Consumer') {
      this.neonList = this.cachedList.filter(c => c.type === 'consumer');
      this.currentFilter = type;

    } else  if (type === 'Business') {
      this.neonList = this.cachedList.filter(c => c.type === 'business');
      this.currentFilter = type;

    } else if (type === 'all') {
      this.neonList = this.cachedList;
      this.currentFilter = 'tous-les-neons';

    } else {
      this.neonList = this.cachedList.filter(c => c.typo === type);

    }
  }

  logout() {
    localStorage.clear();
    currentView.caca = 'login';
  }

fromCreatedToDT(command) {
  console.log('COMANNNANZAFJAEJOF ', this.currentFile, this.commandPrice);
  if (this.currentFile  !== '' && this.currentFile && this.commandPrice > 0) {
    const price = this.commandPrice.toString();
    const params = new HttpParams().set('userId', command['userId']).set('commandId', command['id']).set('price', price); // Create new HttpParams
    const formData: FormData = new FormData();
    formData.append('file', this.currentFile);
    this.loading = true;
    this.http.post('https://neon-server.herokuapp.com/fileUpload', formData, {params: params}).subscribe((user) => {
      console.log('sucess:' , user);
      setTimeout(() => {
        this.fetchCommands();
        this.loading = false;
        this.neonSelected = 'none';
      }, 1000);

    }, err => console.log('err' , err));
  } else {
    alert('Pour importer le DT il faut importer le fichier et entrer le prix du néon');
  }
}

  exportAsXLSX() {
    this.excelData = [];
    this.neonList.forEach((neon) => {
      this.excelData.push({nom: neon['userFull']['name'], prenom:  neon['userFull']['nickname'], type: neon['type'], email: neon['email'],
        prix: neon['price'], typo: neon['typo'], couleur: neon['colors'], etat: neon['state']  });
    });
    console.log('the data for excel file  ', this.excelData);
    this.excelService.exportAsExcelFile(this.excelData, 'liste-' + this.currentFilter);
  }
deleteCommand(command) {
  const del = confirm('Confirmer vouloir effacer ' + command.text);
  if (del) {
    if (command['userFull']) {
      command['userFull']['commands'] =  command['userFull']['commands'].filter(c => c.id !== command.id);

      this.http.put('https://neon-server.herokuapp.com/users/' + command['userId'],  command['userFull']).subscribe((res) => {
        // this.fetchCommands();
        alert('Commande effacée');
        setTimeout(() => {
          this.fetchCommands();
        }, 1000);

      }, err => {
        if (err.status === 200) {
          alert('Commande effacée');
          setTimeout(() => {
            this.fetchCommands();
          }, 500);
          // this.fetchCommands();
        }
      });
    } else {
      alert('cant delete');
    }
  }

}

updateField(currentNeon, type){
  console.log('update field requested, ', currentNeon, type);
  const val = prompt('Entrer nouvelle valeur: ');
  const upd = confirm('Confirmer vouloir changer par  ' + val);
  if(upd) {
    if (this.neonSelected['userId']) {
      if( this.neonSelected['userFull']['commands'].find(c => c.id === this.neonSelected['id'])[type]) {
        console.log('found : ',  this.neonSelected['userFull']['commands'].find(c => c.id === this.neonSelected['id'])[type])
        // this.neonSelected['userFull']['commands'] =  this.neonSelected['userFull']['commands'].find(c => c.id === this.neonSelected['id'])[type] = val;
        
        this.neonSelected['userFull']['commands'].find(c => c.id === this.neonSelected['id'])[type] = val;

      } else {
        console.log('unfound command')
      }

      this.http.put('https://neon-server.herokuapp.com/users/' + this.neonSelected['userId'],  this.neonSelected['userFull']).subscribe((res) => {
        // this.fetchCommands();
        alert('Commande modifiée');
        setTimeout(() => {
          this.fetchCommands();
        }, 1000);

      }, err => {
        if (err.status === 200) {
          alert('Commande modifiée');
          setTimeout(() => {
            this.fetchCommands();
          }, 500);
          // this.fetchCommands();
        }
      });
    } else {
      alert('cant modifier');
    }
  }
  
}

changePrice(price) {
  if ( price > 0) {
    this.commandPrice = price;
  } else {
    alert('entre un prix valide petit coquin');
  }
}
  fetchCommands() { 
    this.loading = true;
    this.neonList = [];
    this.currentFile = null,
    this.commandPrice = 0;
    this.numOfCommands = 0;
    this.numOfCreated = 0;
    this.numOfDT = 0;
    this.numOfPayes = 0;

    this.getConfig().subscribe((res: Array<Object>) => {
      this.loading = false;
      if (res) {
        res.forEach((user) => {
          console.log(user)
          if (user['commands'].length > 0) {
           user['commands'].forEach((command) => {
             this.neonList.push({email: user['email'], type: user['type'], text: command['text'], state: command['state'], price: command['price'], userId: user['id'], id: command['id'],
             commandInfo: command['commandInfo'], filePath: command['filePath'], userFull: user , typo: command['typo'],
              colors: command['colors'], height: command['height'], support: command['support'], telecommande: command['telecommande'] , waterproof: command['waterproof'], date: command['date']});
              this.numOfCommands++;
              if (command['state'] === 'En cours de design') {
                  this.numOfCreated++;
              }
              if (command['state'] === 'Prêt') {
                this.numOfDT++;
            }
            if (command['state'] === 'payé') {
              this.numOfPayes++;
          }
           });
          }
        });
      }
      console.log('User data after fetch : ', this.neonList);
      this.cachedList = this.neonList;
    });
  }

  importDT(event, command) {
    console.log('import DT. file :', event, ' command: ', command);
    this.currentFile = event.target.files[0];

  }

  getConfig() {
    return this.http.get('https://neon-server.herokuapp.com/users');
  }

  getUserById(id) {
    return this.http.get('https://neon-server.herokuapp.com/users/' + id);
  }


}
