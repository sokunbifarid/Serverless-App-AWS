import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3';
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';

//const XAWS = AWSXRay.captureAWS(AWS)

//import { createDynamoDBClient } from './attachmentUtils';

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic


export class get_todo_items {
  async get_all_todo(id : string): Promise<TodoItem[]> {
    console.log('Recalling all todo items');
	const docClient = new AWS.DynamoDB.DocumentClient();
	const todoTable = process.env.TODO_TABLE;
    const result = await docClient.query({
      TableName: todoTable,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
         "#userId": "userId",
      },
      ExpressionAttributeValues: {
         ":userId": id,
      } 
	}).promise();

    const items = result.Items;
    return items as TodoItem[]
  }
}


export class create_todo_items {
  async create_new_todo(todoInput:TodoItem): Promise<TodoItem> {
    console.log('Creating new todo items');
	const docClient = new AWS.DynamoDB.DocumentClient();
	const todoTable = process.env.TODO_TABLE;
    await docClient.put({
      TableName: todoTable,
      Item: todoInput
    }).promise();

    return todoInput as TodoItem
  }
}

export class update_todo_items {
	async update_all_todo(update_event:TodoUpdate, content_id:string, id:string): Promise<TodoUpdate> {
	    console.log("Reloading Old Todo Items");
	    const docClient = new AWS.DynamoDB.DocumentClient();
		const todoTable = process.env.TODO_TABLE;
		const associate = await docClient.update({
			TableName: todoTable,
			Key: {
				"userId": id,
				"todoId": content_id
			},
			UpdateExpression: "set #itemname = :name, #deploydate = :date, #curr_status = :status",
			ExpressionAttributeNames: {
				"#itemname": "name",
				"#deploydate": "dueDate",
				"#curr_status": "done"
			},
			ExpressionAttributeValues: {
				":name": update_event['name'],
				":date": update_event['dueDate'],
				":curr_status": update_event['done']
			},
			ReturnValues: "ALL_NEW"
		}).promise();
		const value = associate.Attributes;
		return value as TodoUpdate;
	}
}


export class delete_todo_items {
	async delete_this_todo_item(content_id:string, id:string): Promise<string> {
		console.log("Queue Freeing Todo Items");
	  	const docClient = new AWS.DynamoDB.DocumentClient();
		const todoTable = process.env.TODO_TABLE;
		let response = "deleted";
		await docClient.delete({
			TableName: todoTable,
			Key: {
				"userId": id,
				"todoId": content_id
			},
			}).promise();
		return response;
	}
}


export class get_upload_url {
	async get_required_link(content_id:string): Promise<string> {
		console.log("Populating required link");
		const bucketDatabase_name = process.env.S3_BUCKET_NAME
		const bucketClient : Types = new AWS.S3({ signatureVersion: 'v4' })
        const linked = bucketClient.getSignedUrl('putObject', {
            Bucket: bucketDatabase_name,
            Key: content_id,
            Expires: 1000,
        });
        return linked as string;
    }
}