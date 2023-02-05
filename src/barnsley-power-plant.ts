import {
  AbstractPowerPlant,
  PowerProductionStep,
  PowerProductionTimeInterval
} from './power-plant';

export interface BarnsleyPowerProductionStep {
  start_time: number;
  end_time: number;
  value: number;
}

export class BarnsleyPowerPlant extends AbstractPowerPlant {
  readonly id = 'barnsley';
  readonly powerProductionTimeInterval: PowerProductionTimeInterval = 1800;

  constructor() {
    super();
  }

  adaptPowerProductionStep(step: BarnsleyPowerProductionStep): PowerProductionStep {
    const { start_time, end_time, value } = step;
    return this.setPowerProductionStep(start_time, end_time, value);
  }
}
