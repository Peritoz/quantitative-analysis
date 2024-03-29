import ModelElement from '@libs/model/model_element';
import Relationship from '@libs/model/relationship';
import Process from '@libs/model/process';
import Resource from '@libs/model/resource';
import InternalBehaviour from '@libs/model/internal_behaviour';
import ExternalBehaviour from '@libs/model/external_behaviour';
import JsonModel from '@libs/model/interfaces/json_model';
import { TemporalUnit } from '@libs/model/enums/temporal_unit_enum';
import FrequencyMeasure from '@libs/model/frequency_measure';
import TemporalMeasure from '@libs/model/temporal_measure';

function stringToUnit(unit: string | undefined): TemporalUnit {
  if (unit !== undefined) {
    switch (unit.toLowerCase()) {
      case 'sec':
        return TemporalUnit.SEC;
      case 'min':
        return TemporalUnit.MIN;
      case 'hour':
        return TemporalUnit.HOUR;
    }
  }

  return TemporalUnit.SEC;
}

export default class Model {
  name: string = 'Unknown';
  processes: Array<Process> = [];
  elements: Array<ModelElement> = [];
  relationships: Array<Relationship> = [];

  constructor(data: Partial<Model> = {}) {
    Object.assign(this, data);
  }

  protected validateRelationship(source: ModelElement, target: ModelElement): boolean {
    /**
     * Valid relationships:
     *
     * Resource -> Internal Behaviour
     * Internal Behaviour -> External Behaviour
     * External Behaviour -> Process
     * External Behaviour -> Internal Behaviour
     */
    return (
      (source instanceof Resource && target instanceof InternalBehaviour) ||
      (source instanceof InternalBehaviour && target instanceof ExternalBehaviour) ||
      (source instanceof ExternalBehaviour && target instanceof Process) ||
      (source instanceof ExternalBehaviour && target instanceof InternalBehaviour)
    );
  }

  getName(): string {
    return this.name;
  }

  getElement(elementName: string): ModelElement | undefined {
    return this.elements.find(e => e.getName() === elementName.toUpperCase());
  }

  getElements(): Array<ModelElement> {
    return this.elements;
  }

  getRelationships(): Array<Relationship> {
    return this.relationships;
  }

  getAllByType(typeConstructor: any): Array<ModelElement> {
    return this.getElements().filter(e => e instanceof typeConstructor);
  }

  getOutRelationships(element: ModelElement): Array<Relationship> {
    return this.relationships.filter(r => r.getSource().getName() === element.getName());
  }

  getInRelationships(element: ModelElement | undefined): Array<Relationship> {
    return this.relationships.filter(r => r.getTarget().getName() === element?.getName());
  }

  removeElement(elementName: string): void {
    const key = elementName.toUpperCase();
    const elementIndex = this.elements.findIndex(e => e.getName() === key);

    if (elementIndex !== -1) {
      this.elements = this.elements.filter(e => e.getName() !== key);
      this.removeRelationshipsToElement(elementName);
    }
  }

  removeRelationshipsToElement(elementName: string): void {
    const key = elementName.toUpperCase();

    // Inbound
    this.relationships = this.relationships.filter(r => r.getTarget().getName() !== key);

    // Outbound
    this.relationships = this.relationships.filter(r => r.getSource().getName() !== key);
  }

  removeRelationship(sourceName: string, targetName: string): void {
    const sourceKey = sourceName.toUpperCase();
    const targetKey = targetName.toUpperCase();
    const relIndex = this.relationships.findIndex(
      r => r.getSource().getName() === sourceKey && r.getTarget().getName() === targetKey,
    );

    if (relIndex !== -1) {
      this.relationships = this.relationships.filter(
        r => !(r.getSource().getName() === sourceKey && r.getTarget().getName() === targetKey),
      );
    }
  }

  createRelationship(sourceName: string, targetName: string, cardinality: number): void {
    const source = this.elements.find(e => e.getName() === sourceName.toUpperCase());
    const target = this.elements.find(e => e.getName() === targetName.toUpperCase());

    if (source) {
      if (target) {
        if (this.validateRelationship(source, target)) {
          const relationshipObject = new Relationship({
            source,
            target,
            cardinality,
          });

          this.relationships.push(relationshipObject);
        }
      } else {
        console.warn(`Orphan relationship. Target "${targetName}" not found`);
      }
    } else {
      console.warn(`Orphan relationship. Source "${sourceName}" not found`);
    }
  }

  createProcess(process: {
    name: string;
    requestFrequency: number;
    frequencyPeriod?: TemporalUnit;
  }): void {
    const requestFrequencyMeasure = new FrequencyMeasure(
      process.requestFrequency,
      process.frequencyPeriod,
    );

    const elementObject = new Process({
      name: process.name,
      requestFrequency: requestFrequencyMeasure,
      frequencyPeriod: process.frequencyPeriod,
    });

    this.elements.push(elementObject);
    this.processes.push(elementObject);
  }

  createResource(resource: { name: string; capacity?: number }): void {
    const elementObject = new Resource(resource);
    this.elements.push(elementObject);
  }

  createInternalBehaviour(internalBehaviour: {
    name: string;
    serviceTime: number;
    timeUnit?: TemporalUnit;
  }): void {
    const serviceTimeMeasure = new TemporalMeasure(
      internalBehaviour.serviceTime,
      internalBehaviour.timeUnit,
    );

    const elementObject = new InternalBehaviour({
      name: internalBehaviour.name,
      serviceTime: serviceTimeMeasure,
      timeUnit: internalBehaviour.timeUnit,
    });
    this.elements.push(elementObject);
  }

  createExternalBehaviour(externalBehaviour: { name: string }): void {
    const elementObject = new ExternalBehaviour(externalBehaviour);
    this.elements.push(elementObject);
  }

  setProcessRequestFrequency(processName: string, requestFrequency: number): void {
    const process = this.processes.find(p => p.getName() === processName.toUpperCase());

    if (process) {
      process.setRequestFrequency(requestFrequency);
    } else {
      throw new Error(`Process "${processName}" not found. Unable to set request frequency`);
    }
  }

  setServiceTime(internalBehaviourName: string, serviceTime: number): void {
    const internalBehaviour = this.elements.find(
      e => e.getName() === internalBehaviourName.toUpperCase(),
    );

    if (internalBehaviour && internalBehaviour instanceof InternalBehaviour) {
      (internalBehaviour as InternalBehaviour).setServiceTime(serviceTime);
    } else {
      throw new Error(
        `Internal behaviour "${internalBehaviourName}" not found. Unable to set service time`,
      );
    }
  }

  setResourceCapacity(resourceName: string, capacity: number): void {
    const resource = this.elements.find(e => e.getName() === resourceName.toUpperCase());

    if (resource && resource instanceof Resource) {
      (resource as Resource).setCapacity(capacity);
    } else {
      throw new Error(`Resource "${resourceName}" not found. Unable to set capacity`);
    }
  }

  fromJSON(modelInput: Partial<JsonModel>): void {
    if (
      modelInput.name &&
      modelInput.elements &&
      Array.isArray(modelInput.elements) &&
      modelInput.relationships &&
      Array.isArray(modelInput.relationships)
    ) {
      const { name, elements, relationships } = modelInput;

      this.name = name;

      for (let i = 0; i < elements.length; i++) {
        const { name, frequencyPeriod, requestFrequency, capacity, serviceTime, timeUnit, type } =
          elements[i];

        if (name) {
          switch (type) {
            case 'process':
              if (requestFrequency) {
                this.createProcess({
                  name,
                  requestFrequency,
                  frequencyPeriod: stringToUnit(frequencyPeriod),
                });
              } else {
                throw new Error(
                  `Invalid model. Request Frequency is required for Processes. Missing value for ${name}`,
                );
              }
              break;
            case 'resource':
              this.createResource({ name, capacity });
              break;
            case 'internal_behaviour':
              if (serviceTime) {
                this.createInternalBehaviour({
                  name,
                  serviceTime,
                  timeUnit: stringToUnit(timeUnit),
                });
              } else {
                throw new Error(
                  `Invalid model. Service Time is required for Internal Behaviours. Missing value for ${name}`,
                );
              }
              break;
            case 'external_behaviour':
              this.createExternalBehaviour({ name });
              break;
          }
        }
      }

      for (let i = 0; i < relationships.length; i++) {
        const { source, target, cardinality } = relationships[i];

        this.createRelationship(source, target, cardinality);
      }
    } else {
      throw new Error('Invalid model input');
    }
  }
}
