import { Component, ElementRef, ViewChild } from '@angular/core';
import { BpmnService } from './bpmn.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  @ViewChild('jsDropZone', { static: true }) private el: ElementRef;;
  @ViewChild('canvas', { static: true }) private canvas: ElementRef;
  
  constructor(public bpmnService: BpmnService) {}

  create() {
    this.bpmnService.createNewDiagram(this.el);
  }

  ngAfterContentInit() {
    this.bpmnService.attachModeler(this.canvas);
  }

}
