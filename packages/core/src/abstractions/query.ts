export abstract class Query {
  abstract readonly name: string;
  readonly params: Record<string, any>;
  constructor(params: Record<string, any>) {
    this.params = params;
  }
}

export abstract class QueryHandler {
  protected queryHandlerMap: {
    [queryName: string]: (query: Query) => Promise<any>;
  } = {};

  async handle(query: Query) {
    if (this.queryHandlerMap[query.name]) {
      return await this.queryHandlerMap[query.name](query);
    } else {
      throw new Error("Query not found: " + query.name);
    }
  }

  protected registerQueryHandler(
    queryName: string,
    handler: (query: Query) => any
  ) {
    this.queryHandlerMap[queryName] = handler;
  }
}
