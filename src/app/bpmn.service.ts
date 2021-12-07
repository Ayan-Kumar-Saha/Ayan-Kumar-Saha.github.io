import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import * as BpmnViewer from 'bpmn-js/dist/bpmn-viewer.production.min.js';
import { Subject } from 'rxjs';
import { BpmnConstantsService } from './bpmn-constants.service';

@Injectable({
  providedIn: 'root',
})
export class BpmnService {
  private _bpmnModeler: any;
  private _bpmnViewer: any;
  private _renderer: Renderer2 = null;
  private _bpmnInstance: any;

  public eventOutput: Subject<null | string> = new Subject<null>();

  constructor(private _rendererFactory: RendererFactory2) {
    this._bpmnModeler = new BpmnModeler({ keyboard: { bindTo: document } });
    this._bpmnViewer = new BpmnViewer({ keyboard: { bindTo: document } });
    this._renderer = _rendererFactory.createRenderer(null, null);
  }

  public async createNewDiagram(
    xml: string,
    el: ElementRef,
    editableMode: boolean = true
  ): Promise<void> {
    const diagramXML = xml ? xml : BpmnConstantsService.NEW_DIAGRAM_XML;
    await this.openDiagram(diagramXML, el, editableMode);
  }

  public async openDiagram(
    xml: string,
    el: ElementRef,
    editableMode: boolean = true
  ): Promise<void> {
    try {
      if (editableMode) {
        this._bpmnInstance = this._bpmnModeler;
      } else {
        this._bpmnInstance = this._bpmnViewer;
      }
      await this._bpmnInstance.importXML(xml);

      this.changeShapeColor(this._bpmnInstance);
   
      this._bpmnInstance.get('canvas').zoom('fit-viewport', 'auto');

      this._renderer.addClass(el.nativeElement, 'with-diagram');
      this._renderer.removeClass(el.nativeElement, 'with-error');

      var eventBus = this._bpmnInstance.get('eventBus');

      eventBus.on('element.dblclick', (e) => {
        this.eventOutput.next(e.element.id);
      });

      // eventBus.on('commandStack.shape.create.postExecute', (e) => {
      //   console.log("ADDED");
        
      //   this.changeShapeColor(this._bpmnInstance);
      // });

      // eventBus.on('shape.changed', (e) => {
      //   this.changeShapeColor(this._bpmnInstance);
      // });

    } catch (err) {
      this._renderer.removeClass(el.nativeElement, 'with-diagram');
      this._renderer.addClass(el.nativeElement, 'with-error');
    }
  }

  public attachModelerToCanvas(el: ElementRef): void {
    this._bpmnInstance.attachTo(el.nativeElement);
  }

  public closeDiagram() {
    this._bpmnInstance.destroy();
  }

  public async exportDiagram(): Promise<string> {
    const result = await this._bpmnInstance.saveXML();
    const { xml } = result;

    return xml;
  }

  public zoomController(step: number, resetZoom: boolean = false) {
    if (resetZoom) {
      this._bpmnInstance.get('canvas').zoom('fit-viewport', 'auto');
      return;
    }
    this._bpmnInstance.get('zoomScroll').stepZoom(step);
  }

  public toggleFullScreenView(el: ElementRef) {
    if (!document.fullscreenElement) {
      el.nativeElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  private changeShapeColor(bpmnInstance) {
    var modeling = bpmnInstance.get('modeling');

    var elements = bpmnInstance.get('elementRegistry').getAll()

    var generalEvents = bpmnInstance.get('elementRegistry').getAll().filter((element) => {
      return (element.type != "bpmn:StartEvent") && (element.type != "bpmn:EndEvent")
    })
    var flowEvents = bpmnInstance.get('elementRegistry').getAll().filter((element) => {
      return (element.type == "bpmn:StartEvent") || (element.type == "bpmn:EndEvent")
    })

    elements.forEach(ele => console.log(ele.type))
    
    console.log('FLOWEVENT', flowEvents);
    console.log('GENERALEVENTS', generalEvents);
    
    // setting colors
    modeling.setColor(generalEvents, {
      stroke: '#333',
      fill: '#FFE37E',
    });

    modeling.setColor(flowEvents, {
      stroke: '#25364B',
      fill: '#fff',
    });
  }
}
