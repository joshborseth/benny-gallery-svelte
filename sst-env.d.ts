/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "BennyBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "Web": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
  }
}
export {}
