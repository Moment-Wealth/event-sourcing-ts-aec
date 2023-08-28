#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EventSourcingStack } from "./event-sourcing-stack";

const app = new cdk.App();
new EventSourcingStack(app, "EventSourcingStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
