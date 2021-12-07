import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { of, Subject } from 'rxjs';
import { BpmnConstantsService } from './bpmn-constants.service';

@Injectable({
  providedIn: 'root',
})
export class BpmnService {
  private _bpmnModeler: any;
  private _renderer: Renderer2 = null;

  public eventOutput: Subject<null | string> = new Subject<null>();

  constructor(private _rendererFactory: RendererFactory2) {
    this._bpmnModeler = new BpmnModeler({ keyboard: { bindTo: document } });
    this._renderer = _rendererFactory.createRenderer(null, null);
  }

  public async createNewDiagram(xml: string, el: ElementRef): Promise<void> {
    const diagramXML = xml ? xml : BpmnConstantsService.NEW_DIAGRAM_XML;
    await this.openDiagram(diagramXML, el);
  }

  public async openDiagram(xml: string, el: ElementRef): Promise<void> {
    try {
      await this._bpmnModeler.importXML(xml);
      this._bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');

      this._renderer.addClass(el.nativeElement, 'with-diagram');
      this._renderer.removeClass(el.nativeElement, 'with-error');

      var eventBus = this._bpmnModeler.get('eventBus');

      eventBus.on('element.dblclick', (e) => {
        this.eventOutput.next(e.element.id);
      });
    } catch (err) {
      this._renderer.removeClass(el.nativeElement, 'with-diagram');
      this._renderer.addClass(el.nativeElement, 'with-error');
    }
  }

  public attachModelerToCanvas(el: ElementRef): void {
    this._bpmnModeler.attachTo(el.nativeElement);
  }

  public closeDiagram() {
    this._bpmnModeler.destroy();
  }

  public async exportDiagram(): Promise<string> {
    const result = await this._bpmnModeler.saveXML();
    const { xml } = result;

    return xml;
  }

  public zoomController(step: number, resetZoom: boolean = false) {
    if (resetZoom) {
      this._bpmnModeler.get('canvas').zoom('fit-viewport', 'auto');
      return;
    }
    this._bpmnModeler.get('zoomScroll').stepZoom(step);
  }
}
