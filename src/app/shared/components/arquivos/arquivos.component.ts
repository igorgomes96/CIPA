import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ToastType } from '../toasts/toasts.component';
import { ToastsService } from 'src/app/core/services/toasts.service';
import { Arquivo } from 'src/app/core/models/arquivo';
import { ArquivosApiService } from 'src/app/core/api/arquivos-api.service';

@Component({
  selector: 'app-arquivos',
  templateUrl: './arquivos.component.html',
  styleUrls: ['./arquivos.component.css']
})
export class ArquivosComponent implements OnInit {

  @Input() arquivos: Arquivo[];
  @Output() upload = new EventEmitter<FileList>();
  @Output() delete = new EventEmitter<number>();
  @Input() dropzoneColor = 'white';
  @Input() spinner = false;

  constructor(private service: ArquivosApiService, private toast: ToastsService) { }

  ngOnInit() {
  }

  download(arquivo: Arquivo) {
    this.service.download(arquivo.id).subscribe(res => {
      const a = document.createElement('a');
      const binaryData = [];
      binaryData.push(res);
      a.href = window.URL.createObjectURL(new Blob(binaryData, { type: arquivo.contentType }));
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.download = arquivo.nome;
      a.click();
      window.URL.revokeObjectURL(a.href);
      a.remove(); // remove the element
    });

  }

  deleteFile(id: string) {
    this.toast.confirm('Essa ação não poderá ser desfeita!', 'Confirma exlusão?')
      .subscribe((confirmacao: boolean) => {
        if (confirmacao) {
          this.service.delete(id).subscribe(_ => {
            this.delete.emit();
            this.toast.showMessage({
              message: 'Arquivo excluído com sucesso!',
              title: 'Sucesso!',
              type: ToastType.success
            });
          });
        }
      });
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.upload.emit(event.dataTransfer.files);
  }

  onInputChange(event: any) {
    this.upload.emit(event.target.files);
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }

}
