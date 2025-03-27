# Deployment Guide for AWS Lambda with CloudFormation

## Prerequisites

Before deploying, ensure you have the following installed and configured:

- **AWS CLI**: [Install AWS CLI](https://aws.amazon.com/cli/)
- **AWS Credentials**: Run `aws configure` and enter your AWS access key, secret key, region, and output format.
- **Node.js and npm**: Install [Node.js](https://nodejs.org/)
- **Permissions**: Ensure your AWS IAM user has permissions to deploy CloudFormation stacks, manage S3, Lambda, and API Gateway.

## Deployment Steps

### 1. Install Dependencies

Navigate to the project directory and install required dependencies:

```sh
npm install --production
```

### 2. Package the Lambda Function

Run the following command to zip the Lambda function:

```sh
zip -r lambda.zip lambda.js node_modules
```

### 3. Upload to S3

Modify the `S3_BUCKET` value in `deploy.sh` to match your S3 bucket. Then upload the zipped Lambda function:

```sh
aws s3 cp lambda.zip s3://my-lambda-bucket/my-lambda-code.zip
```

### 4. Deploy CloudFormation Stack

Deploy the CloudFormation template (`deploy.yml`):

```sh
aws cloudformation deploy \
    --stack-name MyStack \
    --template-file deploy.yml \
    --capabilities CAPABILITY_NAMED_IAM
```

### 5. Update the Lambda Function Code

After deploying the stack, update the Lambda function with the latest code:

```sh
aws lambda update-function-code \
    --function-name MyLambdaFunction \
    --s3-bucket my-lambda-bucket \
    --s3-key my-lambda-code.zip
```

### 6. Verify Deployment

Check if the Lambda function was updated successfully:

```sh
aws lambda get-function --function-name MyLambdaFunction
```

To test the API Gateway endpoint, retrieve the API Gateway URL from the CloudFormation stack output or AWS console and send a request:

```sh
curl https://your-api-gateway-url/lambda
```

## Troubleshooting

- **Permission Errors**: Ensure your IAM user/role has the necessary permissions for S3, Lambda, and CloudFormation.
- **S3 Bucket Not Found**: Make sure the S3 bucket exists and is accessible.
- **Lambda Execution Errors**: Check Lambda logs in CloudWatch:
  ```sh
  aws logs describe-log-groups
  aws logs tail /aws/lambda/MyLambdaFunction --since 1h --follow
  ```

## Cleanup

To remove the CloudFormation stack and associated resources:

```sh
aws cloudformation delete-stack --stack-name MyStack
```

This will delete all resources created by the stack except for manually uploaded items like S3 objects.

---

Deployment should now be complete! 🚀 Let me know if you need any help.
