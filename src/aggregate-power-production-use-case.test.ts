import assert from 'assert';
import barnsleyExpectedData from '../mock-data/barnsley-standardized.json';
import barnsleyData from '../mock-data/barnsley.json';
import { default as hawesData, default as hawesExpectedData } from '../mock-data/hawes.json';
import { AggregatePowerProductionUseCase } from './aggregate-power-production-use-case';
import { BarnsleyPowerPlant } from './barnsley-power-plant';
import { HawesPowerPlant } from './hawes-power-plant';

// Assert barnsley mocked power production data are for one day ((24h*60m*60s) / 1800s)
assert.equal(barnsleyData.length, 48);
// Assert hawes mocked power production data are for one day ((24h*60m*60s) / 900s)
assert.equal(hawesData.length, 96);

jest.spyOn(BarnsleyPowerPlant.prototype, 'fetchPowerProduction').mockResolvedValue(barnsleyData);
jest.spyOn(HawesPowerPlant.prototype, 'fetchPowerProduction').mockResolvedValue(hawesData);

describe('AggregatePowerProductionUseCase', () => {
  let aggregatePowerProductionUseCase: AggregatePowerProductionUseCase;

  beforeEach(() => {
    aggregatePowerProductionUseCase = new AggregatePowerProductionUseCase();
  });

  it('should return agregated power production from Barnsley and Hawes', async () => {
    const powerProduction = await aggregatePowerProductionUseCase.execute(
      new Date(2020, 1, 1),
      new Date(2020, 1, 2)
    );
    const expectedProwerProduction = barnsleyExpectedData.map((step, index) => ({
      start: step.start,
      end: step.end,
      power: step.power + hawesExpectedData[index].power
    }));
    expect(powerProduction.length).toEqual(96);
    expect(powerProduction).toEqual(expectedProwerProduction);
  });
});
