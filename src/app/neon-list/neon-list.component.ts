
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currentView } from './../app.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-neon-list',
  templateUrl: './neon-list.component.html',
  styleUrls: ['./neon-list.component.scss']
})
export class NeonListComponent implements OnInit {

  constructor(private http: HttpClient) { }
  neonSelected = null;
  neonList = [];
  commandMode = false;
  user = {};
  handler: any;
  snackbarClass = '';
  snackMsg = 'Oops'
  commandInfos: { nom: string, prénom: string, adresse: string, ville: string, ['code-postal']: string, pays: string, téléphone: string }
    = { nom: '', prénom: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };;
  errorMessage = 'Des champs sont incomplets...'
  commandFailed = false;
  loading = false;
  payInfos = {};
  payMode = false;
  // colorsList = {
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
  //   blancFroid:'#ffffff',
    
  // }
  //  [
  //   {name: 'blancFroid' , color: '#ffffff'},
  //   {name: 'blancChaud' , color: '#ddcaaf'},
  //   {name: 'orange' , color: '#ffa42c'},
  //   {name: 'jaune' , color: '#ffe600'},
  //   {name: 'rouge' , color: '#ff0000'},
  //   {name: 'rose' , color: '#ff73ff'},
  //   {name: 'fuschia' , color: '#df29ff'},
  //   {name: 'violet' , color: '#9527ff'},
  //   {name: 'bleu' , color: '#337dff'},
  //   {name: 'vert' , color: '#15e81f'},
  //   {name: 'turquoise' , color: '#17fff9'},
  // ]
  ngOnInit() {

    // this.axiosClient.get('http://localhost:5555').then(((res) => {alert(res)}))
    this.fetchCommands();
  }
  openSnackbar(msg) {
    this.snackbarClass = 'show ';
    this.snackMsg = msg;
    setTimeout(() => { this.snackbarClass = ''; }, 3000);
  }
  fetchCommands() {
    this.neonList = []
    this.loading = true;
    this.getConfig().subscribe((res: Array<Object>) => {
      if (res) {
        this.loading = false;
        console.log('ok ', res, localStorage.getItem('email'))
        if (!res.find(x => x['email'] === localStorage.getItem('email')) || !localStorage.getItem('email')) {
          this.openSnackbar('Vous n êtes pas connecté à votre compte. Veuillez vous connecter ou créer un compte.')
          currentView['caca'] = 'login'
        } else {
          console.log(localStorage.getItem('email'))
          var commands = res.find(x => x['email'] === localStorage.getItem('email'))['commands']
          this.user = res.find(x => x['email'] === localStorage.getItem('email'));
          console.log(commands)

          commands.forEach((command) => {
            this.neonList.push(command)
          })
        }

      }
      console.log('User data after fetch : ', this.neonList);
    })
  }

  goToForm() {
    currentView.caca = 'form'
  }

  getConfig() {
    return this.http.get('https://neon-server.herokuapp.com/users');
  }

  dlFile(url) {
    // window.location.href=url;
    this.http.get(url,
      { responseType: 'blob' }).subscribe(data => saveAs(data, `pdf report.pdf`));
  }

  goToNeonDetail(neonPayload) {
    console.log('the neon to see: ', neonPayload);
    if (neonPayload) {
      this.neonSelected = neonPayload
    } 

  }
  onChangeCommandInfo(field, value: string) {
    this.commandInfos[field] = value;
  }


  previous() {
    this.commandMode = false;
  }

  changeCommandToPaid() {
    this.user['commands'].find(c => c.id === this.neonSelected.id)['state'] = 'payé';
    this.user['changeCommand'] = {text: 'Votre facture', newState: 'payé'};

    this.http.put('https://neon-server.herokuapp.com/users/' + this.user['id'], this.user).subscribe((res) => {
      this.openSnackbar('Nous avons bien reçu votre commande. La facture vous a été envoyé par mail. Merci !')
      // this.fetchCommands();

    }, err => {
      if (err.status === 200) {
        this.openSnackbar('Nous avons bien reçu votre commande. La facture vous a été envoyé par mail. Merci !')
        // this.fetchCommands();
      }
    });
  }
  openCommand() {
    if (this.neonSelected.state === "commandé") {
      this.commandFailed = false;
      this.payInfos = { nom: '', prénom: '', société: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
      this.commandMode = false;
      // this.payMode = true;
      // setTimeout(() => {
      //   this.loading = false;

      // }, 3000);
      // this.loadStripe();
      // this.handler = (<any>window).StripeCheckout.configure({
      //   key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
      //   locale: 'auto',
      //   token:  (token: any) => {
      //     // You can access the token ID with `token.id`.
      //     // Get the token ID to your server-side code for use.
      //     console.log(token)
      //     // this.openSnackbar('Nous avons bien reçu votre commande. La facture vous a été envoyé par mail. Merci !')

      //     this.loading = false;
      //     this.payMode = true;
      //     this.removeStripe();
      //     this.changeCommandToPaid();
      //   }
      // });
   
      // this.handler.open({
      //   name: 'Stripe payment for:  ' + this.neonSelected.text,
      //   // description: '2 widgets',
      //   amount: this.neonSelected.price * 100
      // });
    } else {
      this.commandFailed = false;
      this.commandInfos = { nom: '', prénom: '',  adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
      this.commandMode = !this.commandMode;

    }

  }

  command() {
    for (const field in this.commandInfos) {
      if (this.commandInfos[field].trim() === '') {
        this.commandFailed = true;
        this.errorMessage = 'Oops ! Le champ ' + field.toUpperCase() + ' est manquant...';
        return;
      }
    }
    console.log('the command is valid :', this.commandInfos);
    this.commandFailed = false;
    this.payMode = true;
    // this.loading = true;
    // this.user['commands'].find(c => c.id === this.neonSelected.id)['commandInfo'] = this.commandInfos;
    // this.user['commands'].find(c => c.id === this.neonSelected.id)['state'] = 'commandé';
    // this.user['changeCommand'] = {text: 'Vous avez commandé', newState: 'commandé'};

    // this.http.put('https://neon-server.herokuapp.com/users/' + this.user['id'], this.user).subscribe((res) => {
    //   this.openSnackbar('Votre demande à été enregistrée. Notre équipe va designer votre dessin technique !')

    //   this.fetchCommands();

    // }, err => {
    //   if (err.status === 200) {
    //     this.openSnackbar('Votre demande à été enregistrée. Notre équipe va designer votre dessin technique !')
    //     this.fetchCommands();
    //   }
    // });

  }
  removeStripe() {
    // !window.document.getElementById('stripe-script')
    document.getElementById("stripe-script").outerHTML = "";

  }
  // loadStripe() {

  //   if(!window.document.getElementById('stripe-script')) {
  //     var s = window.document.createElement("script");
  //     s.id = "stripe-script";
  //     s.type = "text/javascript";
  //     s.src = "https://checkout.stripe.com/checkout.js";
      
  //     // s.onload = () => { this.loading = false;
  //     //   this.handler = (<any>window).StripeCheckout.configure({
  //     //     key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
  //     //     locale: 'auto',
  //     //     token: function (token: any) {
  //     //       // You can access the token ID with `token.id`.
  //     //       // Get the token ID to your server-side code for use.
  //     //       console.log(token)
  //     //       alert('Payment Success!!');
  //     //     }
  //     //   });
  //     // }
       
  //     window.document.body.appendChild(s);
  //   }
  // }
} 
