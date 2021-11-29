import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';

@Injectable({
  providedIn: 'root',
})
export class BpmnService {
  private readonly NEW_DIAGRAM_XML = `
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
   <bpmn2:process id="Process_1" isExecutable="false">
      <bpmn2:startEvent id="StartEvent_1" />
   </bpmn2:process>
   <bpmndi:BPMNDiagram id="BPMNDiagram_1">
      <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
         <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0" />
         </bpmndi:BPMNShape>
      </bpmndi:BPMNPlane>
   </bpmndi:BPMNDiagram>
  </bpmn2:definitions>;`
  
  private bpmnModeler;
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.bpmnModeler = new BpmnModeler();
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public async createNewDiagram(el: ElementRef): Promise<void> {
    await this.openDiagram(this.NEW_DIAGRAM_XML, el);
  }

  public async openDiagram(xml: string, el: ElementRef) {
    try {
      await this.bpmnModeler.importXML(xml);
      
      this.renderer.addClass(el.nativeElement, 'with-diagram');
      this.renderer.removeClass(el.nativeElement, 'with-error');

    } catch (err) {
      this.renderer.removeClass(el.nativeElement, 'with-diagram');
      this.renderer.addClass(el.nativeElement, 'with-error');
    }
  }

  public attachModeler(el: ElementRef) {
    this.bpmnModeler.attachTo(el.nativeElement);
  }

  public closeDiagram() {
    this.bpmnModeler.destroy();
  }

  public saveDiagram() {
    
  }
}
