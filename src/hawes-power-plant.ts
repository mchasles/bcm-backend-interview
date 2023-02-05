import {
  AbstractPowerPlant,
  PowerProductionStep,
  PowerProductionTimeInterval
} from './power-plant';

export interface HawesPowerProductionStep {
  start: number;
  end: number;
  power: number;
}

export class HawesPowerPlant extends AbstractPowerPlant {
  readonly id = 'hawes';
  readonly powerProductionTimeInterval: PowerProductionTimeInterval = 900;

  constructor() {
    super();
  }

  adaptPowerProductionStep(step: HawesPowerProductionStep): PowerProductionStep {
    const { start, end, power } = step;
    return this.setPowerProductionStep(start, end, power);
  }
}
