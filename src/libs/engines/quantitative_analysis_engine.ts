import WorkloadEngine from "@libs/engines/workload_engine";
import PerformanceEngine from "@libs/engines/performance_engine";
import Model from "@libs/model/model";
import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";
import {formatNumber} from "@libs/utils/format_number";
import {normalizeDistribution} from "@libs/utils/normalization";

export default class QuantitativeAnalysisEngine {
    protected workloadEngine: WorkloadEngine;
    protected performanceEngine: PerformanceEngine;

    constructor(model: Model) {
        this.workloadEngine = new WorkloadEngine(model);
        this.performanceEngine = new PerformanceEngine(model);
    }

    getAllMetrics(includeNormalizedValues: boolean = false): Array<QuantitativeMetric> {
        const workloadMetrics: Array<Partial<QuantitativeMetric>> = this.workloadEngine.getAllWorkloadsMetrics();
        const metrics: Array<QuantitativeMetric> = this.performanceEngine.getAllPerformanceMetrics();

        // Combining metrics
        for (let i = 0; i < workloadMetrics.length; i++) {
            const workloadMetric = workloadMetrics[i];

            let metric: QuantitativeMetric | undefined = metrics.find(
                m => m.internalBehaviour === workloadMetric.internalBehaviour &&
                    m.externalBehaviour === workloadMetric.externalBehaviour);

            if (metric !== undefined && workloadMetric.workload !== undefined) {
                metric.workload = workloadMetric.workload;
            }
        }

        // Calculating normalized values
        if (includeNormalizedValues) {
            // Getting normalized workload
            normalizeDistribution<QuantitativeMetric>(
                metrics,
                (element: QuantitativeMetric) => {
                    return element.workload;
                },
                (element: QuantitativeMetric, value: number) => {
                    element.normalizedWorkload = value;
                }
            );

            // Getting normalized response time
            normalizeDistribution<QuantitativeMetric>(
                metrics,
                (element: QuantitativeMetric) => {
                    return element.responseTime;
                },
                (element: QuantitativeMetric, value: number) => {
                    element.normalizedResponseTime = value;
                }
            );

            // Getting normalized processing time
            normalizeDistribution<QuantitativeMetric>(
                metrics,
                (element: QuantitativeMetric) => {
                    return element.processingTime;
                },
                (element: QuantitativeMetric, value: number) => {
                    element.normalizedProcessingTime = value;
                }
            );
        }

        return metrics;
    }

    getAllMetricsAsCsv(separator: string = ";", includeNormalizedValues: boolean = false): Array<string> {
        const sep = separator;
        const metrics: Array<QuantitativeMetric> = this.getAllMetrics(includeNormalizedValues);
        let response: Array<string> = [`resource${sep}service${sep}wLoad${sep}procTime${sep}respTime${sep}util`];

        for (let i = 0; i < metrics.length; i++) {
            const metric = metrics[i];

            const line =
                `${metric.resource}${sep}` +
                `${metric.externalBehaviour}${sep}` +
                `${formatNumber(metric.workload)}${sep}` +
                `${formatNumber(metric.processingTime)}${sep}` +
                `${formatNumber(metric.responseTime)}${sep}` +
                `${formatNumber(metric.resourceUtilization)}`;

            response.push(line);
        }

        return response;
    }
}