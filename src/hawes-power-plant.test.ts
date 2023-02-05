import assert from 'assert';
import { default as data, default as expectedData } from '../mock-data/hawes.json';
import { HawesPowerPlant, HawesPowerProductionStep } from './hawes-power-plant';
import { AbstractPowerPlant } from './power-plant';

jest.spyOn(AbstractPowerPlant.prototype, 'fetchPowerProduction').mockResolvedValue(data);
// Assert hawes mocked power production data are for one day ((24h*60m*60s) / 900s)
assert.equal(data.length, 96);

describe('HawesPowerPlant', () => {
  let hawesPowerPlant: HawesPowerPlant;

  beforeEach(() => {
    hawesPowerPlant = new HawesPowerPlant();
  });

  it('should return standardized power production data', async () => {
    const powerProduction = await hawesPowerPlant.getPowerProduction<HawesPowerProductionStep>(
      new Date(2020, 1, 1),
      new Date(2020, 1, 2)
    );
    expect(powerProduction.length).toEqual(96);
    expect(powerProduction).toEqual(expectedData);
  });

  it('should interpolate a step with average power production when a step is missing', async () => {
    const dataWithMissingStep = [...data];
    dataWithMissingStep.splice(2, 1);

    const expectedDataWithInterpolatedStep = JSON.parse(JSON.stringify(expectedData));
    const averageInterpolatedPower = Math.round(
      (dataWithMissingStep[1].power + dataWithMissingStep[2].power) / 2
    );
    expectedDataWithInterpolatedStep[2].power = averageInterpolatedPower;

    jest
      .spyOn(AbstractPowerPlant.prototype, 'fetchPowerProduction')
      .mockResolvedValueOnce(dataWithMissingStep);
    const powerProduction = await hawesPowerPlant.getPowerProduction<HawesPowerProductionStep>(
      new Date(2020, 1, 1),
      new Date(2020, 1, 2)
    );
    expect(powerProduction.length).toEqual(96);
    expect(powerProduction).toEqual(expectedDataWithInterpolatedStep);
  });
});
