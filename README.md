# Habitica-Webhooks

This app is designed to recieve webhooks from various sources and process that data.

Right now it only recieves webhooks from Github and uploads changes to sprites to S3.

## Github Setup

Go to the settings of the habitrpg repo and add a new webhook for the push event. Add `http://urlwhereappisdeployed.com/github/repo` and include a secret string (Make note of this).

You will need to supply a few environmental variables, whether through a config.json file or passed in on the command line.

| env variable               | description                                                                                                                          |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| GITHUB_SECRET              | the secret string supplied when setting up the webhook                                                                               |
| GITHUB_BRANCH_TO_WATCH     | the branch where changes should be inspected; Defaults to `develop`                                                                  |
| S3_SPRITES_DIRECTORY       | the directory in the bucket where the sprites should be uploaded to                                                                  |
| S3_BUCKET_NAME             | The s3 bucket that you upload to                                                                                                     |
| S3_REGION                  | the region where the bucket resides                                                                                                  |
| S3_ACCESS_KEY              | the public key for s3                                                                                                                |
| S3_SECRET_KEY              | the secret key for s3                                                                                                                |

## Tests

```bash
npm test
```
