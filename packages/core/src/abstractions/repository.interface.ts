export interface IRepository<A> {
  save(aggregate: A, version: number): Promise<void>;
  get(id: string, version: number): Promise<A>;
}
