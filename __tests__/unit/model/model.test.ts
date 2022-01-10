import {Model} from "../../../src/index";
import {TemporalUnit} from "../../../src/libs/model/enums/TemporalUnitEnum";

describe("Model", () => {
    let instance: Model;

    beforeEach(() => {
        instance = new Model({name: "Test"});
    });

    describe("Importing", () => {
        it("should import model from JSON", () => {
            const modelInput = require("../data/example.json");

            instance.fromJSON(modelInput);

            expect(instance.getElements().length).toBe(27);
            expect(instance.getRelationships().length).toBe(29);
        });
    });

    describe("Builder - Creation", () => {
        it("should create an process element", () => {
            instance.createProcess({name: "Process", requestFrequency: 400, frequencyPeriod: TemporalUnit.MIN});

            const element = instance.getElement("PROCESS");

            expect(element.getName()).toBe("PROCESS");
        });

        it("should create a resource element", () => {
            instance.createResource({name: "Resource", capacity: 1});

            const element = instance.getElement("RESOURCE");

            expect(element.getName()).toBe("RESOURCE");
        });

        it("should create an external behaviour element", () => {
            instance.createExternalBehaviour({name: "External Behaviour"});

            const element = instance.getElement("EXTERNAL BEHAVIOUR");

            expect(element.getName()).toBe("EXTERNAL BEHAVIOUR");
        });

        it("should create an internal behaviour element", () => {
            instance.createInternalBehaviour({
                name: "Internal Behaviour",
                serviceTime: 0.5,
                timeUnit: TemporalUnit.SEC
            });

            const element = instance.getElement("INTERNAL BEHAVIOUR");

            expect(element.getName()).toBe("INTERNAL BEHAVIOUR");
        });

        it("should create relationships", () => {
            instance.createExternalBehaviour({name: "B"});
            instance.createInternalBehaviour({name: "A", serviceTime: 0.5, timeUnit: TemporalUnit.SEC});
            instance.createRelationship("A", "B", 2);

            const relationships = instance.getInRelationships(instance.getElement("B"));

            expect(relationships.length).toBe(1);
            expect(relationships[0].getSource().getName()).toBe("A");
        });
    });

    describe("Builder - Deletion", () => {
        it("should remove a relationship", () => {
            instance.createExternalBehaviour({name: "B"});
            instance.createInternalBehaviour({name: "A", serviceTime: 0.5, timeUnit: TemporalUnit.SEC});
            instance.createRelationship("A", "B", 2);

            instance.removeRelationship("A", "B");

            const relationships = instance.getInRelationships(instance.getElement("B"));

            expect(relationships.length).toBe(0);
        });

        it("should remove an element and its relationships", () => {
            instance.createExternalBehaviour({name: "A"});
            instance.createInternalBehaviour({name: "B", serviceTime: 0.5, timeUnit: TemporalUnit.SEC});
            instance.createInternalBehaviour({name: "C", serviceTime: 0.5, timeUnit: TemporalUnit.SEC});
            instance.createRelationship("B", "A", 2);
            instance.createRelationship("C", "A");

            instance.removeElement("A");
            const element = instance.getElement("A");
            const relationships = instance.getInRelationships(instance.getElement("A"));

            expect(element).toBe(undefined);
            expect(relationships.length).toBe(0);
        });
    });
});