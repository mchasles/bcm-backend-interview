import assert from 'assert';
import expectedData from '../mock-data/barnsley-standardized.json';
import data from '../mock-data/barnsley.json';
import { BarnsleyPowerPlant, BarnsleyPowerProductionStep } from './barnsley-power-plant';
import { AbstractPowerPlant } from './power-plant';

jest.spyOn(AbstractPowerPlant.prototype, 'fetchPowerProduction').mockResolvedValue(data);
// Assert barnsley mocked power production data are for one day ((24h*60m*60s) / 1800s)
assert.equal(data.length, 48);

describe('BarnsleyPowerPlant', () => {
  let barnsleyPowerPlant: BarnsleyPowerPlant;

  beforeEach(() => {
    barnsleyPowerPlant = new BarnsleyPowerPlant();
  });

  it('should return standardized power production data', async () => {
    const powerProduction =
      await barnsleyPowerPlant.getPowerProduction<BarnsleyPowerProductionStep>(
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
      (dataWithMissingStep[1].value + dataWithMissingStep[2].value) / 2
    );
    expectedDataWithInterpolatedStep[4].power = averageInterpolatedPower;
    expectedDataWithInterpolatedStep[5].power = averageInterpolatedPower;

    jest
      .spyOn(AbstractPowerPlant.prototype, 'fetchPowerProduction')
      .mockResolvedValueOnce(dataWithMissingStep);
    const powerProduction =
      await barnsleyPowerPlant.getPowerProduction<BarnsleyPowerProductionStep>(
        new Date(2020, 1, 1),
        new Date(2020, 1, 2)
      );
    expect(powerProduction.length).toEqual(96);
    expect(powerProduction).toEqual(expectedDataWithInterpolatedStep);
  });
});
