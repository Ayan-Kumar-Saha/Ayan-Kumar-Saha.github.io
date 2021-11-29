import { Component, ElementRef, ViewChild } from '@angular/core';
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

  constructor(public bpmnService: BpmnService) {}

  create() {
    this.bpmnService.createNewDiagram(
      BpmnConstantsService.NEW_DIAGRAM_XML,
      this.el
    );
  }

  async ngOnInit() {
    const diagram = localStorage.getItem('diagram');
    await this.bpmnService.createNewDiagram(diagram, this.el);

    this.bpmnService?.eventOutput?.subscribe(res => {
      console.log('CLICKED 🚀', res);
    })
  }

  ngAfterContentInit() {
    this.bpmnService.attachModelerToCanvas(this.canvas);
  }

  async save() {
    const xml = await this.bpmnService.exportDiagram();
    localStorage.setItem('diagram', xml);
  }
}
