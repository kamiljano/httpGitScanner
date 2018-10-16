# Notice

The work on this project is still ongoing. Don't bother taking that into use until it's properly finished.

# About

The project contains an AWS lambda that can be triggered by an SNS event from the pathFinderLambda: https://github.com/kamiljano/pathFinderLambda .
More specifically, once the path finder lambda generates a notification that a GIT repository has been detected,
this lambda downloads that repository in search of any credentials.

# Local execution

    serverless invoke local --function handle --path events/detectedGit.json --tempDir <somePathOnYourDriveForTemporaryFiles>