import { BarnsleyPowerPlant } from './barnsley-power-plant';
import { HawesPowerPlant } from './hawes-power-plant';
import { PowerProductionStep } from './power-plant';

export class AggregatePowerProductionUseCase {
  public async execute(from: Date, to: Date): Promise<PowerProductionStep[]> {
    const barnsleyPowerPlant = new BarnsleyPowerPlant();
    const hawesPowerPlant = new HawesPowerPlant();

    const barnsleyPowerProduction = await barnsleyPowerPlant.getPowerProduction(from, to);
    const hawesPowerProduction = await hawesPowerPlant.getPowerProduction(from, to);

    return barnsleyPowerProduction.map((step, index) => ({
      start: step.start,
      end: step.end,
      power: step.power + hawesPowerProduction[index].power
    }));
  }
}
