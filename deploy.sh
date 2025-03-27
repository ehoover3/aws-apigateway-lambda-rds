#!/bin/bash

# Set variables
LAMBDA_FUNCTION_NAME="MyLambdaFunction"
ZIP_FILE="lambda.zip"
S3_BUCKET="my-lambda-bucket"
S3_KEY="my-lambda-code.zip"
STACK_NAME="MyStack"

# Zip the Lambda function
echo "Zipping Lambda function..."
zip -r $ZIP_FILE lambda.js node_modules

# Upload to S3
echo "Uploading to S3..."
aws s3 cp $ZIP_FILE s3://$S3_BUCKET/$S3_KEY

# Deploy CloudFormation Stack
echo "Deploying CloudFormation stack..."
aws cloudformation deploy \
    --stack-name $STACK_NAME \
    --template-file deploy.yml \
    --capabilities CAPABILITY_NAMED_IAM

# Update Lambda function code
echo "Updating Lambda function..."
aws lambda update-function-code \
    --function-name $LAMBDA_FUNCTION_NAME \
    --s3-bucket $S3_BUCKET \
    --s3-key $S3_KEY

echo "Deployment complete!"
