import { Model, QuantitativeAnalysisEngine } from '../../../src';

describe('Quantitative Analysis Engine', () => {
  let instance: Model;

  beforeEach(() => {
    const modelInput = require('../data/example.json');

    instance = new Model({ name: 'Test' });
    instance.fromJSON(modelInput);
  });

  describe('Complete Execution', () => {
    it('should return all quantitative analysis metrics', () => {
      const analysisEngine = new QuantitativeAnalysisEngine(instance);
      const metrics = analysisEngine.getAllMetrics(true);

      const dataAccessResult = metrics.find(m => m.externalBehaviour === 'DATA ACCESS');
      const viewDamageReport = metrics.find(m => m.externalBehaviour === 'VIEW DAMAGE REPORT');
      const databaseEntry = metrics.find(m => m.externalBehaviour === 'DATABASE ENTRY');

      expect(metrics.length).toBe(9);
      expect(dataAccessResult).not.toBe(undefined);
      expect(dataAccessResult!.workload).not.toBe(undefined);
      expect(dataAccessResult!.processingTime).not.toBe(undefined);
      expect(dataAccessResult!.responseTime).not.toBe(undefined);
      expect(dataAccessResult!.resourceUtilization).not.toBe(undefined);
      expect(dataAccessResult!.workload!.toFixed(4)).toBe('0.0278');
      expect(dataAccessResult!.processingTime!.toFixed(4)).toBe('0.2000');
      expect(dataAccessResult!.responseTime!.toFixed(4)).toBe('0.2011');
      expect(dataAccessResult!.resourceUtilization!.toFixed(4)).toBe('0.0056');

      expect(viewDamageReport!.workload!.toFixed(4)).toBe('0.0313');
      expect(viewDamageReport!.processingTime!.toFixed(4)).toBe('2.0000');
      expect(viewDamageReport!.responseTime!.toFixed(4)).toBe('2.1333');
      expect(viewDamageReport!.resourceUtilization!.toFixed(4)).toBe('0.0625');

      expect(databaseEntry!.workload!.toFixed(4)).toBe('0.0069');
      expect(databaseEntry!.processingTime!.toFixed(4)).toBe('0.5000');
      expect(databaseEntry!.responseTime!.toFixed(4)).toBe('0.5070');
      expect(databaseEntry!.resourceUtilization!.toFixed(4)).toBe('0.0139');
    });

    it('should return a CSV output', () => {
      const analysisEngine = new QuantitativeAnalysisEngine(instance);
      const metrics = analysisEngine.getAllMetricsAsCsv(';', false);

      const dataAccessResult = metrics.find(l => l.includes('DATA ACCESS'));
      const viewDamageReport = metrics.find(l => l.includes('VIEW DAMAGE REPORT'));
      const databaseEntry = metrics.find(l => l.includes('DATABASE ENTRY'));

      expect(metrics.length).toBe(10);
      expect(metrics[0]).toBe('resource;service;wLoad;procTime;respTime;util');
      expect(dataAccessResult).toBe(
        'DATABASE SERVER RESOURCE;DATA ACCESS;0,0278;0,2000;0,2011;0,0056',
      );
      expect(viewDamageReport).toBe(
        'VIEW COMPONENT RESOURCE;VIEW DAMAGE REPORT;0,0313;2,0000;2,1333;0,0625',
      );
      expect(databaseEntry).toBe(
        'DATABASE SYSTEM RESOURCE;DATABASE ENTRY;0,0069;0,5000;0,5070;0,0139',
      );
    });
  });
});
