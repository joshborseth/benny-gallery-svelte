/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "AfterBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "BeforeBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "Web": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
    "WebPConverter": {
      "name": string
      "type": "sst.aws.Function"
      "url": string
    }
  }
}
export {}
