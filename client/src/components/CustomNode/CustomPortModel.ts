import { PortModel, DefaultLinkModel } from '@projectstorm/react-diagrams';

export class CustomPortModel extends PortModel {
    constructor({ }) {
        super({
            name: "tommy",
            type: 'custom_question_node',
        });
    }

    createLinkModel() {
        return new DefaultLinkModel();
    }
}