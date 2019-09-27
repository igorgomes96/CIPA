import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ResultadoApuracao, Apuracao, Resultado } from 'src/app/shared/models/apuracao';
import { EleicoesApiService } from 'src/app/core/api/eleicoes-api.service';
import { Eleicao } from 'src/app/shared/models/eleicao';

@Component({
  selector: 'app-relacao-candidatos',
  templateUrl: './relacao-candidatos.component.html',
  styleUrls: ['./relacao-candidatos.component.css']
})
export class RelacaoCandidatosComponent implements OnInit {

  @Input() eleicao: Eleicao;
  @Input() resultado: ResultadoApuracao;
  @Input() downloadRelatorio = new EventEmitter<{}>();
  constructor(private eleicoesApi: EleicoesApiService) { }

  ngOnInit() {
    this.downloadRelatorio.subscribe(_ => this.download());
    console.log(this.resultado);
  }

  get candidatos(): Apuracao[] {
    return !this.resultado ? [] : this.resultado.efetivos.concat(this.resultado.suplentes).concat(this.resultado.naoEleitos);
  }

  resultadoClass(candidato: Apuracao): string {
    switch (candidato.resultadoApuracao) {
      case Resultado.Efetivo:
        return 'label-primary';
      case Resultado.Suplente:
        return 'label-success';
      case Resultado.NaoEleito:
        return 'label-danger';
      default:
        return '';
    }
  }

  private download() {
    this.eleicoesApi.downloadRelatorioCandidatos(this.eleicao.id, 'Candidatos.xlsx').subscribe();
  }

}
