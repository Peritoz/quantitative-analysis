const util = require("util");
const fs = require("fs");
const Model = require("../lib/model/Model");
const modelInput = require("./example.json");
const AnalysisEngine = require("../lib/engines/QuantitativeAnalysisEngine");

const model = new Model({name: "Test"});
model.fromJSON(modelInput);

const analysisEngine = new AnalysisEngine({model});
const metrics = analysisEngine.getAllMetricsAsCsv(",");

console.log(util.inspect(metrics, true, null, true));

fs.writeFileSync("./output.csv", metrics.join("\n"));