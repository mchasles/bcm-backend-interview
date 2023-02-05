const POWER_PRODUCTION_ENDPOINT = 'https://interview.beta.bcmenergy.fr';
const STANDARD_POWER_PRODUCTION_INTERVAL = 900;

export type PowerProductionTimeInterval = 900 | 1800 | 3600;

export interface PowerProductionStep {
  start: number;
  end: number;
  power: number;
}

interface IPowerPlant {
  getPowerProduction(from: Date, to: Date): Promise<PowerProductionStep[]>;
}

export abstract class AbstractPowerPlant implements IPowerPlant {
  abstract readonly id: string;
  abstract readonly powerProductionTimeInterval: PowerProductionTimeInterval;

  abstract adaptPowerProductionStep(step: unknown): PowerProductionStep;

  async fetchPowerProduction<T>(from: Date, to: Date): Promise<T[]> {
    const url = new URL(this.id, POWER_PRODUCTION_ENDPOINT);
    const searchParams = new URLSearchParams({
      from: this.formatDateParam(from),
      to: this.formatDateParam(to)
    });
    const response = await fetch(`${url}?${searchParams.toString()}`);

    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject('An error occurred.');
    }
  }

  async getPowerProduction<T>(from: Date, to: Date): Promise<PowerProductionStep[]> {
    const data = await this.fetchPowerProduction<T>(from, to);

    return data.reduce(
      (powerSteps: PowerProductionStep[], powerProductionStep: T, currentIndex) => {
        const step = this.adaptPowerProductionStep(powerProductionStep);
        const previousStep =
          currentIndex === 0 ? null : this.adaptPowerProductionStep(data[currentIndex - 1]);

        // If a step is missing
        if (previousStep && step.start !== previousStep.end) {
          const missingStep = this.setMissingPowerProductionStep(previousStep, step);
          powerSteps.push(...this.getStandardizedPowerProductionSteps(missingStep));
        }

        powerSteps.push(...this.getStandardizedPowerProductionSteps(step));

        return powerSteps;
      },
      []
    );
  }

  private formatDateParam(date: Date): string {
    const padLeft = (nb: number) => nb.toString().padStart(2, '0');
    return [padLeft(date.getDate()), padLeft(date.getMonth()), date.getUTCFullYear()].join('-');
  }

  private getStandardizedPowerProductionSteps(step: PowerProductionStep) {
    const newNbSteps = (step.end - step.start) / STANDARD_POWER_PRODUCTION_INTERVAL;

    return Array(newNbSteps)
      .fill(null)
      .reduce((acc: PowerProductionStep[], _, currentIndex) => {
        const hasPreviousStep = acc.length !== 0;
        const previousStep = hasPreviousStep ? acc[currentIndex - 1] : null;

        acc.push(
          previousStep
            ? this.setPowerProductionStep(
                previousStep.end,
                previousStep.end + STANDARD_POWER_PRODUCTION_INTERVAL,
                step.power
              )
            : this.setPowerProductionStep(
                step.start,
                step.start + STANDARD_POWER_PRODUCTION_INTERVAL,
                step.power
              )
        );

        return acc;
      }, []);
  }

  private setMissingPowerProductionStep(
    previousStep: PowerProductionStep,
    nextStep: PowerProductionStep
  ) {
    return {
      start: previousStep.end,
      end: nextStep.start,
      power: Math.round((previousStep.power + nextStep.power) / 2)
    };
  }

  protected setPowerProductionStep(start: number, end: number, power: number) {
    return {
      start,
      end,
      power
    };
  }
}
