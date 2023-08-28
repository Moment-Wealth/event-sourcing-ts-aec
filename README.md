# Installation
There are three packages in this repo: "core", "readAPI" and "writeAPI" - "core" has no entrypoins, and the two APIs import it locally, so it must be installed before them.
You can do it on liner with this command:
```sh
(cd packages/core/ && npm i && npm run build);(cd packages/readAPI/ && npm i);(cd packages/writeAPI/ && npm i);
```
# Running 
Before running, set up the right variables in your environment to authenticate with dynamodb and mongodb:
```
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
MONGO_DB_NAME=""
MONGO_SECRET_KEY=""
MONGO_USER_ID=""
```
You can also use a .env file and run the command with dotenv-cli: `dotenv -e .env <command>`

To run either of the API servers, just cd to ther directory and run `npm run start:dev`. readAPI runs on 3001, writeAPI on 3000

# Testing
The core package has some unit tests that can be run with: `npm run test`

For the APIs, the postman collection has the happy paths [https://www.postman.com/material-administrator-90074691/workspace/eventsourcing/request/29291067-b35b4744-49a9-4d89-a5cf-8673e9e8a7ee]

With the writeAPI, you need to first run the "creation" command, copy the id in the result and use that for the other commands.

With the readAPI, the inputs are in query params that can be played with.

# Event Sourcing implementation

I took some liberties here with the design. The main points about this implementation are:
-  The ggregate is simpler. Events are always passed to it, and it doesn't create events in its own.  Events change the aggregate state, it stores the events/version, and flushes them on commit. The aggregate also aborts if an event would lead to an invalid state.
- The aggregate constructor is the applier of the creation event. It takes the event as input, and is the only way the aggregate can be instantiated.
- The command handler has more reponsibilities: it manges instantiating the events, applying them to the aggregate, and persisting. It's responsile for avoiding posible side-effects.
- The event handler acts only on new events and does not rehydrate. This is easy with this infrastructure beause we have a guarantee that events will come in order, and will keep blocking the hadnelr and retrying on failure (for up to 24h). We'd still want a way to rehydrate and overwrite the read model as a backup plan, though,

### Architecture
- writeAPI -> DynamoDB - Dynamo Streams -> Lambda -> MongoDB <- readAPI

### Use case
This is an implementation of a Metrics API, e.g for keeping setting a business' KPIs or goals and track of progress. It's possible to set targets for a specific deadline, and track changes in value over time. A metric is expired when it hits the deadline, and it is successful if the value becomes larger or equal to the target. Event Sourcing is a good fit for this use case, both because of the need for auditing, and because it makes it very convenient to store the individual value updates over time.



