export default interface QuantitativeMetric {
  resource: string;
  internalBehaviour: string;
  externalBehaviour: string;
  workload: number;
  normalizedWorkload?: number;
  processingTime: number;
  normalizedProcessingTime?: number;
  responseTime: number;
  normalizedResponseTime?: number;
  resourceUtilization: number; // Utilization is in percentage, so it doesn't make much sense to normalize
}
