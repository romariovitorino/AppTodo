import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { toastController } from '@ionic/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // adicionando uma lista de tarefas( um array de objetos para a tarefa)
  tarefas: any[] = [];
  constructor(private alertCrtl: AlertController, private toastCtrl: ToastController, private actionSheetCrtl: ActionSheetController) {
    let tarefaSalva = localStorage.getItem('tarefaUsuario');

    if (tarefaSalva != null) {
      this.tarefas = JSON.parse(tarefaSalva);
    }

  }

  async showAdd() {
    const alert = await this.alertCrtl.create({
      cssClass: 'my-custom-class',
      header: 'O que você deseja fazer?',
      inputs: [
        {
          name: 'tarefa1',
          type: 'text',
          placeholder: 'Digite o que deseja fazer.',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado com sucesso!');
          },
        },
        {
          text: 'Adicionar',
          handler: (form) => {
            this.adicionaTarefa(form.tarefa1);
          },
        },
      ],
    });

    await alert.present();
  }

  // método para adicionar uma tarefa no local storage
  async adicionaTarefa(novaTarefa: string) {
    // verifica se a variável esta vazia ou não
    if (novaTarefa.trim().length < 1) {
      // caso a variável esteja vazia, irá apresentar uma mensagem no topo da tela
      const toast = await this.toastCtrl.create({
        // mensagem que será apresentada
        message: 'Por favor, digite a tarefa!',
        // duração da mensagem( 2 segundos neste exemplo)
        duration: 2000,
        // posição da mensagem, neste caso será no topo.
        position: 'top',
      });

      toast.present();
      return;
    }

    // definição de uma variável com a estrutura da nossa tarefa
    const tarefa = { nome: novaTarefa, realizada: false };
    // adicionado a tarefa em uma lista de tarefas
    this.tarefas.push(tarefa);

    //depois de atualizar a nossa lista de tarefa, chama a função para salvar no Local Storage
    this.salvaLocalStorage();
  }

  salvaLocalStorage() {
    localStorage.setItem('tarefaUsuario', JSON.stringify(this.tarefas));
  }


  async realizaAcoes(tarefa: any) {
    const actionSheet = await this.actionSheetCrtl.create({
      header: 'Qual ação realizar?',
      buttons: [{
        text: tarefa.realizada ? 'Desmarcar' : 'Marcar',
        icon: tarefa.realizada ? 'checkmark-circle' : 'radio-button-off-outline',
        handler: () => {
          tarefa.realizada = !tarefa.realizada;
          this.salvaLocalStorage();
        }
      },  {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();

  }

   excluirTarefa(tarefa: any){
     this.tarefas = this.tarefas.filter(arrayTarefa => tarefa != arrayTarefa);

     this.salvaLocalStorage();

  }

}



