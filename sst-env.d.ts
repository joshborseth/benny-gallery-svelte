/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "Bus": {
      "arn": string
      "name": string
      "type": "sst.aws.Bus"
    }
    "Fn": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
    "Web": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
  }
}
export {}
