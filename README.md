# Habitica-Webhooks

This app recieves webhooks from Github and uploads changes to files in watched directories to an S3 bucket. 

## Setup

Go to the settings of the Github repo you desire to watch and add a new webhook for the push event. Add `http://urlwhereappisdeployed.com/webhook` and include a secret string (Make note of this).

You will need to supply a few environmental variables, whether through a config.json file or passed in on the command line as arguments.

| env variable               | description                                                       |
|----------------------------|-------------------------------------------------------------------|
| GITHUB_SECRET              | the secret string supplied when setting up the webhook            |
| GITHUB_BRANCH_TO_WATCH     | the branch where changes should be inspected; usually master      |
| GITHUB_WATCHED_DIRECTORIES | an array of paths to watch                                        |
| S3_BUCKET_NAME             | The s3 bucket that you upload to                                  |
| S3_REGION                  | the region where the bucket resides                               |
| S3_DIRECTORY               | the directory in the bucket where the files should be uploaded to |
| S3_ACCESS_KEY              | the public key for s3                                             |
| S3_SECRET_KEY              | the secret key for s3                                             |

## Tests

```node
npm test
```
