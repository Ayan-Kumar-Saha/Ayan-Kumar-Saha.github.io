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

import CustomPaletteModule from './custom-bpmnjs/context-pad';
import CustomContextPadModule from './custom-bpmnjs/palette';

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

    this._bpmnModeler = new BpmnModeler({
      keyboard: { bindTo: document },
      bpmnRenderer: {
        defaultFillColor: '#FFE37E',
        defaultStrokeColor: '#201C10',
      },
      additionalModules: [CustomPaletteModule, CustomContextPadModule]
    });
    this._bpmnViewer = new BpmnViewer({
      keyboard: { bindTo: document },
      bpmnRenderer: {
        defaultFillColor: '#FFE37E',
        defaultStrokeColor: '#201C10',
      },
    });

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

      // this.changeShapeColor(this._bpmnInstance);

      this._bpmnInstance.get('canvas').zoom('fit-viewport', 'auto');

      this._renderer.addClass(el.nativeElement, 'with-diagram');
      this._renderer.removeClass(el.nativeElement, 'with-error');

      var eventBus = this._bpmnInstance.get('eventBus');

      eventBus.on('element.dblclick', (e) => {
        this.eventOutput.next(e.element.id);
      });
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
}
