import { AggregatePowerProductionUseCase } from './src/aggregate-power-production-use-case';

(async () => {
  const from = new Date(2020, 1, 1);
  const to = new Date(2020, 1, 2);

  const aggregatePowerProductionUseCase = new AggregatePowerProductionUseCase();

  const result = await aggregatePowerProductionUseCase.execute(from, to);

  console.log(result);
})();
