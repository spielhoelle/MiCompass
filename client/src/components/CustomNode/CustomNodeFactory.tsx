import { CustomNodeWidget } from './CustomNodeWidget';
import { CustomNodeModel } from './CustomNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';

//@ts-ignore
export class CustomNodeFactory extends AbstractReactFactory<CustomNodeModel, DiagramEngine> {
    constructor() {
        super('custom_question_node');
    }

    generateReactWidget(event: { model: DefaultNodeModel; }): JSX.Element {
        //@ts-ignore
        return <CustomNodeWidget engine={this.engine} node={event.model} />;
    }

    generateModel(event: { initialConfig: any; }) {
        return new CustomNodeModel(event.initialConfig);
    }
}