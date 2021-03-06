
import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';

// import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';
import { HttpClient } from '@angular/common/http';
import { currentView } from './../app.component';
import { saveAs } from 'file-saver';
import { GoogleAnalyticsService } from '../google-analytics-service.service';
declare var stripe: any;
declare var elements: any;
@Component({
  selector: 'app-neon-list',
  templateUrl: './neon-list.component.html',
  styleUrls: ['./neon-list.component.scss']
})
export class NeonListComponent implements OnInit {
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  resetPass = false;
  loading = false;
  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private googleAnalyticsService: GoogleAnalyticsService
  ) { }

  creditCardList = [
    '../.././assets/neoncadenas.png',
    '../.././assets/neonvisa.png',
    '../.././assets/neonmaster.png',
    '../.././assets/neonamericanexpress.png',

  ]
  slides = [
    {
      url: '../.././assets/Billie-16.png',
      font: 'Billie'
    },
    {
      url: '../.././assets/Cobby-16.png',
      font: 'Cobby'
    },
    {
      url: '../.././assets/Jackie-16.png',
      font: 'Jackie'
    },
    {
      url: '../.././assets/Jerry-16.png',
      font: 'Jerry'
    },
    {
      url: '../.././assets/Jimmy-16.png',
      font: 'Jimmy'
    },
    {
      url: '../.././assets/Johnny-16.png',
      font: 'Johnny'
    },
    {
      url: '../.././assets/Perrie-16.png',
      font: 'Perrie'
    },
  ];

  colorList = [
    { name: 'blanc', color: '#ffffff', url: '../.././assets/blanc.png' },
    { name: 'blanc-chaud', color: '#ede3c5', url: '../.././assets/blancchaud.png' },
    { name: 'orange', color: '#ffa42c', url: '../.././assets/orange.png' },
    { name: 'jaune', color: '#ffe600', url: '../.././assets/jaune.png' },
    { name: 'rouge', color: '#ff0000', url: '../.././assets/rouge.png' },
    { name: 'rose', color: '#ff73ff', url: '../.././assets/rose.png' },
    { name: 'fuschia', color: '#df29ff', url: '../.././assets/fuschia.png' },
    { name: 'violet', color: '#9527ff', url: '../.././assets/violet.png' },
    { name: 'bleu', color: '#337dff', url: '../.././assets/bleu.png' },
    { name: 'vert', color: '#15e81f', url: '../.././assets/vert.png' },
    { name: 'turquoise', color: '#17fff9', url: '../.././assets/turquoise.png' },
  ];
  neonTypoClass = 'Billie';
  neonColorClass = '';
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  neonSelected = null;
  neonList = [];
  commandMode = false;
  user = {};
  customMail = '';
  showLastPage = false;
  handler: any;
  snackbarClass = '';
  snackMsg = 'Oops';
  commandInfos: { nom: string, prénom: string, adresse: string, ville: string, ['code-postal']: string, pays: string, téléphone: string }
    = { nom: '', prénom: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
  errorMessage = 'Des champs sont incomplets...';
  commandFailed = false;
  payInfos = {};
  checkTelecommande = false;
  checkEau = false;
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
    // Your Stripe public key

  }

  ngAfterViewInit() {

  }
  ngOnDestroy() {
    // this.card.removeEventListener('change', this.cardHandler);
    // this.card.destroy();
    if (this.payMode) {
      // this.card.removeEventListener('change', this.cardHandler);
      // this.card.destroy();
    }

  }
  onCheckTelecommande() {
    this.checkTelecommande = !this.checkTelecommande;
    if (this.checkTelecommande) {
      this.neonSelected.price = parseInt(this.neonSelected.price) + 25;
      this.neonSelected['telecommande'] = true;
    } else {
      this.neonSelected.price = parseInt(this.neonSelected.price) - 25;
      this.neonSelected['telecommande'] = false;
    }
  }
  onCheckResEau() {
    this.checkEau = !this.checkEau;
    if (this.checkEau) {
      this.neonSelected.price = parseInt(this.neonSelected.price) + 70;
      this.neonSelected['waterproof'] = true;
    } else {
      this.neonSelected.price = parseInt(this.neonSelected.price) - 70;
      this.neonSelected['waterproof'] = false;

    }
  }
  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  onChangeAdditionnalInfo(text) {
    this.customMail = text;
  }

  sendCustomEmail() {
    if (this.customMail.trim() !== '') {
      this.user['changeCommand'] = { text: '', newState: '' };
      this.user['changeCommand']['text'] = 'customEmail';
      this.user['changeCommand']['newState'] = this.customMail;
      this.loading = true;
      this.googleAnalyticsService.eventEmitter("Demande de modification", this.customMail, this.user['email'], 1);
      this.http.put('https://neon-server.herokuapp.com/users/' + this.user['id'], this.user).subscribe((res) => {
        this.fetchCommands();
        this.neonSelected = null;
        location.reload();

      }, err => {
        if (err.status === 200) {
          this.fetchCommands();
          this.neonSelected = null;
          location.reload();
        }
      });
    }
  }

  async onSubmitPay() {

    const { token, error } = await stripe.createToken(this.card);
    this.loading = true;
    if (error) {
      console.log('Something is wrong:', error);
      this.loading = false;
      alert('La tentative de paiement a échoué...');
    } else {
      console.log('Success!', token);
      this.changeCommandToPaid(token);
      // ...send the token to the your backend to process the charge
    }
  }
  openSnackbar(msg) {
    this.snackbarClass = 'show ';
    this.snackMsg = msg;
    setTimeout(() => { this.snackbarClass = ''; }, 3000);
  }
  fetchCommands() {
    const hardcodedData = [
      // {
      //   id: "aeaze4161631",
      //   text: "Neon premier",
      //   type: "consumer",
      //   typo: "Billy",
      //   state: "created",
      //   colors: "orange",
      //   height: 25,
      //   support: "détouré",
      //   creationDate: "27/12/2019",
      //   imageAdditionalInfo: ""
      // },
      // {
      //   id: "aeaze4161631",
      //   text: "Neon deuxieme",
      //   type: "consumer",
      //   typo: "Billy",
      //   state: "DT disponible",
      //   colors: "orange",
      //   height: 25,
      //   support: "détouré",
      //   creationDate: "27/12/2019",
      //   imageAdditionalInfo: ""
      // }
    ]

    this.neonList = [];
    this.loading = true;
    this.getConfig().subscribe((res: Array<Object>) => {
      if (res) {
        this.loading = false;
        console.log('ok ', res, localStorage.getItem('email'));
        if (!res.find(x => x['email'] === localStorage.getItem('email')) || !localStorage.getItem('email')) {
          // this.openSnackbar('Vous n êtes pas connecté à votre compte. Veuillez vous connecter ou créer un compte.');
          currentView['caca'] = 'login';
        } else {
          console.log(localStorage.getItem('email'));
          const commands = res.find(x => x['email'] === localStorage.getItem('email'))['commands'];
          this.user = res.find(x => x['email'] === localStorage.getItem('email'));
          console.log(commands);

          commands.forEach((command) => {
            this.neonList.push(command);
            console.log(command['colors']);
          });
        }

      } else {
      }
      console.log('User data after fetch : ', this.neonList);
    }, err => {
      console.log('cannot fetch data', hardcodedData);
      this.loading = false;
      this.neonList = hardcodedData;
    });
  }

  getColor(color) {
    for (let i = 0; i <= color.length; i++) {
      if (color[i] === '/') {
        return color.substring(0, i - 1);
      }
    }

  }

  downloadDT() {
    this.googleAnalyticsService.eventEmitter("téléchargement DT", this.neonSelected['text'], this.user['email'], 1);
  }

  logout() {
    localStorage.clear();
    currentView.caca = 'login';
    this.googleAnalyticsService.eventEmitter("déconnexion", "", this.user['email'], 1);
  }
  resetView() {
    this.payMode = false;
    this.showLastPage = false;
    this.commandMode = false;
    this.neonSelected = null;
  }
  goToForm() {
    // window.location.replace("https://dessinemoiunneon.fr/neon-sur-mesure-personnalise");
    window.top.location.href = 'https://dessinemoiunneon.fr/neon-sur-mesure-personnalise/';
    this.googleAnalyticsService.eventEmitter("redirect", "Créer un nouveau néon", this.user['email'], 1);


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
      this.neonSelected = neonPayload;
    }
    this.googleAnalyticsService.eventEmitter("Néon page détaillé", neonPayload['text'], this.user['email'], 1);
  }
  onChangeCommandInfo(field, value: string) {
    this.commandInfos[field] = value;
  }

  fromPayToCommand() {
    // this.card.removeEventListener('change', this.cardHandler);
    // this.card.destroy();
    this.payMode = false;
    this.commandMode = true;
  }

  previous() {
    this.commandMode = false;
    this.googleAnalyticsService.eventEmitter("précédent", 'Go from Commande to Néon détaillé', this.user['email'], 1);
  }

  changeCommandToPaid(token) {
    this.user['commands'].find(c => c.id === this.neonSelected.id)['state'] = 'payé';
    this.user['commands'].find(c => c.id === this.neonSelected.id)['cardToken'] = token;

    this.user['changeCommand'] = { command: this.user['commands'].find(c => c.id === this.neonSelected.id), newState: 'payé' };
    this.http.put('https://neon-server.herokuapp.com/users/' + this.user['id'], this.user).subscribe((res) => {
      this.loading = false;
      this.neonSelected.state = 'payé';
      this.showLastPage = true;
      this.commandMode = false;
      this.payMode = false;
    }, err => {
      if (err.status === 200) {
        // this.openSnackbar('Nous avons bien reçu votre commande. La facture vous a été envoyé par mail. Merci !');
        this.loading = false;
        this.neonSelected.state = 'payé';
        this.showLastPage = true;
        this.commandMode = false;
        this.payMode = false;
        // this.fetchCommands();
      }
    });
  }
  openCommand() {
    if (this.neonSelected.state === 'commandé') {
      this.commandFailed = false;
      // this.payInfos = { nom: '', prénom: '', société: '', adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
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
      // this.commandInfos = { nom: '', prénom: '',  adresse: '', ville: '', ['code-postal']: '', pays: '', téléphone: '' };
      this.commandMode = !this.commandMode;
      this.googleAnalyticsService.eventEmitter("commandButton", "commander", this.user['email'], 1);
    }

  }

  onClickValiderEtPayer() {
    this.googleAnalyticsService.eventEmitter("Paiement button", "payer", this.user['email'], 1);
  }

  command() {
    for (const field in this.commandInfos) {
      if (this.commandInfos[field].trim() === '') {
        this.commandFailed = true;
        this.errorMessage = 'Oops ! Le champ ' + field.toUpperCase() + ' est manquant...';
        this.googleAnalyticsService.eventEmitter("paymentButton", "formulaire mal rempli", this.user['email'], 2);
        return;
      }
    }
    console.log('the command is valid :', this.commandInfos);
    this.commandFailed = false;
    this.payMode = true;
    this.googleAnalyticsService.eventEmitter("paymentButton", "passer au paiement", this.user['email'], 2);

    this.user['commands'].find(c => c.id === this.neonSelected.id)['commandInfo'] = this.commandInfos;
    if (this.card) {
      this.card.destroy();
    }
    setTimeout(() => {

      this.card = elements.create('card');
      this.card.mount(this.cardInfo.nativeElement);
      this.card.addEventListener('change', this.cardHandler);

    }, 10);
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
    document.getElementById('stripe-script').outerHTML = '';

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
