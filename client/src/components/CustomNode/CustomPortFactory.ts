import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

// @ts-ignore
export class CustomPortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
    cb: (initialConfig?: any) => PortModel;

    constructor(type: string, cb: (initialConfig?: any) => PortModel) {
        super(type);
        this.cb = cb;
    }

    generateModel(event): PortModel {
        return this.cb(event.initialConfig);
    }
}