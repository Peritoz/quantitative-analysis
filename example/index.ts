import util from "util";
import fs from "fs";
import Model from "../src/libs/model/Model";
import AnalysisEngine from "../src/libs/engines/QuantitativeAnalysisEngine";

const modelInput = require("./example.json");

const model = new Model({name: "Test"});
model.fromJSON(modelInput);

const analysisEngine = new AnalysisEngine(model);
const metrics = analysisEngine.getAllMetricsAsCsv();

console.log(util.inspect(metrics, true, null, true));

fs.writeFileSync("./output.csv", metrics.join("\n"));