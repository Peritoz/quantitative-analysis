# Quantitative Analysis Engine

Performs quantitative analysis over a normalized model. The result of the analysis includes the following metrics:

- Workload
- Processing Time
- Response Time
- Resource Utilization

This library was based on "Quantitative Analysis of Enterprise Architectures" (2005) from Maria-Eugenia Iacob and Henk Jonkers.

## Installation

Using NPM:

``
npm i --save @peritoz/quantitative-analysis
``

Using Yarn:

``
yarn add @peritoz/quantitative-analysis
``

## Model Structure

The architecture to be analyzed must be described using four basic building blocks: Process, External Behaviour, Internal Behaviour and Resource. These elements are represented below.

![Model representation](./docs/metamodel.jpg)

The structure above represents the normalized model, which is imperative to a proper quantitative analysis.

- **Process**: Represents an entry point to the architecture. Usually it is related to user behaviour. Processes have the following properties:
  - *Request frequency*: Frequency of requests made to the architecture. The frequency is always in amount per unit of time, e.g., 500/s.
- **External Behaviour**: Represents externalized behaviour (service) by a resource (transitively).
- **Internal Behaviour**: Represents internal processing units performed by a resource. Internal behaviours have the following properties:
  - *Service Time*: Processing time for the execution of the behaviour. Long service time will cause excessive utilization of resources, invalidating the analysis.
- **Resource**: Represents active structure elements, i.e., elements capable of performing a behaviour. Resources have the following properties:
  - *Capacity*: The capacity of a resource. The default is one.

## Model Building

There are two main ways to build a model for analysis: Importing a JSON description or using the model builder.

### JSON Importing

The imported JSON must describe the elements and relationships of the model. Relationships must use the element's name as the key. A valid JSON input is presented below.

```
{
  "name": "Insurance",
  "elements": [
    {
      "name": "Claim submission process",
      "type": "process",
      "frequencyPeriod": "hour",
      "requestFrequency": 25
    },
    {
      "name": "Search component Resource",
      "type": "resource",
      "capacity": 1
    },
    {
      "name": "Database server",
      "type": "internal_behaviour",
      "serviceTime": 0.2
    },
    {
      "name": "data access",
      "type": "external_behaviour"
    }
  ],
  "relationships": [
    {
      "source": "data access",
      "target": "Claim handling process",
      "cardinality": 1
    }
  ]
}  
```

Use the ```fromJSON``` method to import the JSON content to the model.

```
const modelInput = require("./input.json");
const model = new Model({name: "JSON Importing"});
model.fromJSON(modelInput);
```

### Model Builder

Alternatively, the model can be built using builder methods:

```
createProcess(process: { name: string, requestFrequency: number, frequencyPeriod?: TemporalUnit })

createExternalBehaviour(externalBehaviour: { name: string })

createInternalBehaviour(internalBehaviour: { name: string, serviceTime: number, timeUnit?: TemporalUnit })

createResource(resource: { name: string, capacity?: number })

createRelationship(sourceName: string, targetName: string, cardinality: number)
```

## Quantitative Analysis

Quantitative analysis provides an analytical tool for workload, response time, processing time and utility estimation.

You can perform quantitative analysis on a Model using the **Quantitative Analysis Engine**.

```
class QuantitativeAnalysisEngine {
    constructor(model: Model);

    getAllMetrics(includeNormalizedValues: boolean = false): Array<QuantitativeMetric>;

    getAllMetricsAsCsv(separator: string = ";", includeNormalizedValues: boolean = false): Array<string>;
}
```

### Example

```
const modelInput = require("./input.json");
const model = new Model({name: "JSON Importing"});
model.fromJSON(modelInput);

const analysisEngine = new QuantitativeAnalysisEngine(model);
const metrics = analysisEngine.getAllMetrics(true);
```

NOTE: The usage depends on a normalized input model.

Please see *"Quantitative Analysis of Enterprise Architectures"* (2005) from **Maria-Eugenia Iacob** and **Henk Jonkers** for more details about the processing algorithm.

### Result

You should expect as a result an array of Quantitative Metrics, as described below:

```
QuantitativeMetric {
    resource: string,
    internalBehaviour: string,
    externalBehaviour: string,
    workload: number,
    processingTime: number,
    responseTime: number,
    resourceUtilization: number,
    normalizedWorkload?: number,
    normalizedProcessingTime?: number,
    normalizedResponseTime?: number,
}
```