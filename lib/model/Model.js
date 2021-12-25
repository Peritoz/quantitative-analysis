const Process = require("./Process");
const Resource = require("./Resource");
const ExternalBehaviour = require("./ExternalBehaviour");
const InternalBehaviour = require("./InternalBehaviour");
const Relationship = require("./Relationship");

class Model {
    constructor({name}) {
        this.name = name;
        this.processes = [];
        this.elements = [];
        this.relationships = [];
    }

    getName() {
        return this.name;
    }

    getNode(nodeName){
        return this.elements.find(e => e.getName() === nodeName.toUpperCase());
    }

    getElements(){
        return this.elements;
    }

    getAllByType(typeConstructor){
        return this.getElements().filter(e => e instanceof typeConstructor);
    }

    getOutRelationships(node) {
        return this.relationships.filter(r => r.getSource().getName() === node.getName());
    }

    getInRelationships(node) {
        return this.relationships.filter(r => r.getTarget().getName() === node.getName());
    }

    fromJSON(modelInput) {
        if (modelInput.name && modelInput.elements && Array.isArray(modelInput.elements) &&
            modelInput.relationships && Array.isArray(modelInput.relationships)) {
            const {name, elements, relationships} = modelInput;

            this.name = name;

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                let elementObject;

                switch (element.type) {
                    case "process":
                        elementObject = new Process(element);
                        this.processes.push(elementObject);
                        break;
                    case "resource":
                        elementObject = new Resource(element);
                        break;
                    case "internal_behaviour":
                        elementObject = new InternalBehaviour(element);
                        break;
                    case "external_behaviour":
                        elementObject = new ExternalBehaviour(element);
                        break;
                }

                this.elements.push(elementObject);
            }

            for (let i = 0; i < relationships.length; i++) {
                const relationship = relationships[i];

                const source = this.elements.find(e => e.getName() === relationship.source.toUpperCase());
                const target = this.elements.find(e => e.getName() === relationship.target.toUpperCase());

                if(source){
                    if(target){
                        const relationshipObject = new Relationship({
                            source,
                            target,
                            cardinality: relationship.cardinality
                        });

                        this.relationships.push(relationshipObject);
                    }else{
                        console.warn(`Orphan relationship. Target "${relationship.target}" not found`);
                    }
                }else{
                    console.warn(`Orphan relationship. Source "${relationship.source}" not found`);
                }
            }
        } else {
            throw new Error("Invalid model input");
        }
    }
}

module.exports = Model;