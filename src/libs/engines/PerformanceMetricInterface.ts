export default interface PerformanceMetricInterface {
    resource: string,
    internalBehaviour: string,
    externalBehaviour: string,
    workload: number,
    processingTime: number,
    responseTime: number,
    resourceUtilization: number
}