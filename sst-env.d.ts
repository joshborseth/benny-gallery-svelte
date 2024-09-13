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
    "DB_KEY": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DB_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "Web": {
      "type": "sst.aws.SvelteKit"
      "url": string
    }
  }
}
export {}
