interface ValueDataPoint {
  value: number;
  date: Date;
}

export class MetricReadModel {
  constructor(
    public readonly _id: string,
    public version: number,
    public readonly name: string,
    public readonly description: string,
    public readonly target: number,
    public readonly deadline: Date,
    public readonly unit: string,
    public readonly values: ValueDataPoint[] = []
  ) {}
}
