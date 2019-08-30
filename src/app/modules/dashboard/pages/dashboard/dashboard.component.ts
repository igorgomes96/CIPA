import { EleicoesApiService } from './../../../../core/api/eleicoes-api.service';
import { Dimensionamento } from 'src/app/shared/models/dimensionamento';
import { Apuracao, ResultadoApuracao } from './../../../../shared/models/apuracao';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Eleicao } from 'src/app/shared/models/eleicao';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  eleicao: Eleicao;
  apuracao: Apuracao[];
  dimensionamento: Dimensionamento;
  ultimaAtualizacao: Date;
  resultado: ResultadoApuracao;

  optionsEleitoresVotantes = [{ nome: 'download', icon: 'fa-download' }];
  optionsCandidatos = [{ nome: 'download', icon: 'fa-download' }];

  donwloadRelatorioCandidatos = new EventEmitter<{}>();

  constructor(
    private route: ActivatedRoute,
    private eleicoesApi: EleicoesApiService) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: any) => {
      this.eleicao = routeData.eleicao;
      this.ultimaAtualizacao = new Date();
      this.dimensionamento = routeData.dimensionamento;
      if (this.dimensionamento.qtdaVotos) {
        this.eleicao = routeData.eleicao;
        this.resultado = routeData.resultado;
        this.apuracao = routeData.apuracao;
      }
    });
  }

  onOptionsEleitoresVotantesClick() {
    this.eleicoesApi.downloadRelatorioVotos(this.eleicao.id, 'Votos.xlsx').subscribe();
  }

  onOptionsCandidatosClick() {
    this.donwloadRelatorioCandidatos.emit();
  }


}
