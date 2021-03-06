import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpmnConstantsService } from './bpmn-constants.service';
import { BpmnService } from './bpmn.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('jsDropZone', { static: true }) private el: ElementRef;
  @ViewChild('canvas', { static: true }) private canvas: ElementRef;

  public canvasMode: string = localStorage.getItem('mode') || 'editor';
  public isFullScreenViewActive: boolean = false;

  constructor(
    public bpmnService: BpmnService,
    private _snackbar: MatSnackBar
  ) {}

  create() {
    this.bpmnService.createNewDiagram(
      BpmnConstantsService.NEW_DIAGRAM_XML,
      this.el
    );
  }

  showSnackBar(message: string) {
    this._snackbar.open(message, 'Ok', { duration: 2000 });
  }

  async ngOnInit() {
    const diagram = localStorage.getItem('diagram');
    await this.bpmnService.createNewDiagram(
      diagram,
      this.el,
      this.canvasMode == 'editor' ? true : false
    );

    this.bpmnService?.eventOutput?.subscribe((res) => {
      this.showSnackBar(`Clicked element 👉 ${res}`);
    });
  }

  ngAfterContentInit() {
    this.bpmnService.attachModelerToCanvas(this.canvas);
  }

  async save() {
    const xml = await this.bpmnService.exportDiagram();
    localStorage.setItem('diagram', xml);

    this.showSnackBar('Saved into local storage!! 🚀')
  }

  zoomIn() {
    this.bpmnService.zoomController(1);
  }

  zoomOut() {
    this.bpmnService.zoomController(-1);
  }

  resetZoom() {
    this.bpmnService.zoomController(0, true);
  }

  fullScreen() {
    this.isFullScreenViewActive = !this.isFullScreenViewActive;
    this.bpmnService.toggleFullScreenView(this.el);
  }

  toggleView() {
    this.canvasMode = this.canvasMode == 'editor' ? 'viewer' : 'editor';
    localStorage.setItem('mode', this.canvasMode);
    
    window.location.reload();
  }
}
