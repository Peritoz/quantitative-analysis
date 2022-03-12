import WorkloadEngine from "@libs/engines/workload_engine";
import PerformanceEngine from "@libs/engines/performance_engine";
import Model from "@libs/model/model";
import QuantitativeMetric from "@libs/model/interfaces/quantitative_metric";
import {formatNumber} from "@libs/utils/format_number";
import {findRanges, normalizeValue} from "@libs/utils/normalization";

export default class QuantitativeAnalysisEngine {
    workloadEngine: WorkloadEngine;
    performanceEngine: PerformanceEngine;

    constructor(model: Model) {
        this.workloadEngine = new WorkloadEngine(model);
        this.performanceEngine = new PerformanceEngine(model);
    }

    getAllMetrics(includeNormalizedValues: boolean = true) {
        const workloadMetrics = this.workloadEngine.getAllWorkloadsMetrics();
        const metrics: Array<Partial<QuantitativeMetric>> = this.performanceEngine.getAllPerformanceMetrics();

        // Combining metrics
        for (let i = 0; i < workloadMetrics.length; i++) {
            const workloadMetric = workloadMetrics[i];

            let metric = metrics.find(m => m.internalBehaviour === workloadMetric.internalBehaviour &&
                m.externalBehaviour === workloadMetric.externalBehaviour);

            if (metric) {
                metric.workload = workloadMetric.workload;
            }
        }

        // Calculating normalized values
        if (includeNormalizedValues) {
            const minMaxMap = findRanges<Partial<QuantitativeMetric>>(metrics);

            for (let i = 0; i < metrics.length; i++) {
                const metric = metrics[i];

                // Getting normalized workload
                if (metric.workload !== undefined && minMaxMap["workload"] !== undefined) {
                    metric.normalizedWorkload = normalizeValue(
                        metric.workload,
                        minMaxMap["workload"].min,
                        minMaxMap["workload"].max
                    );
                }

                // Getting normalized response time
                if (metric.responseTime !== undefined && minMaxMap["responseTime"] !== undefined) {
                    metric.normalizedResponseTime = normalizeValue(
                        metric.responseTime,
                        minMaxMap["responseTime"].min,
                        minMaxMap["responseTime"].max
                    );
                }

                // Getting normalized processing time
                if (metric.processingTime !== undefined && minMaxMap["processingTime"] !== undefined) {
                    metric.normalizedProcessingTime = normalizeValue(
                        metric.processingTime,
                        minMaxMap["processingTime"].min,
                        minMaxMap["processingTime"].max
                    );
                }
            }
        }

        return metrics;
    }

    getAllMetricsAsCsv(separator: string = ";") {
        const sep = separator;
        const metrics = this.getAllMetrics();
        let response = [`resource${sep}service${sep}wLoad${sep}procTime${sep}respTime${sep}util`];

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