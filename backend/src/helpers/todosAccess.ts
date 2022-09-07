import * as AWS from "aws-sdk";
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Types } from 'aws-sdk/clients/s3';
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class syncTodos_host {
	async syncTodos(id): Promise<TodoItem[]> {
			console.log("Regenerating Todo Items");
			const Table_of_items = process.env.TODOS_TABLE;
			const Client_of_doc: DocumentClient = new XAWS.DynamoDB.DocumentClient();
			const value = {
				TableName: Table_of_items,
				KeyConditionExpression: "#userId = :id",
				ExpressionAttributeNames: {
					"#userId": "id"
				},
				ExpressionAttributeValues: {
					":id": id
				}
			};
			const answer = await Client_of_doc.query(value).promise();
			console.log(answer);
			const items = answer.Items;
			return items as TodoItem[];
	}
}

export class newTodos_host {
	async newTodos(data): Promise<TodoItem> {
			console.log("Instancing Todo Items");
			const Table_of_items = process.env.TODOS_TABLE;
			const Client_of_doc: DocumentClient = new XAWS.DynamoDB.DocumentClient();
			const value = {
				TableName: Table_of_items,
				Item: data,
			};
			const answer = await Client_of_doc.put(value).promise();
			console.log(answer);
			return data as TodoItem;
	}
}

export class reloadTodos_host {
	async reloadTodos(update_event, content_id, id): Promise<TodoUpdate> {
			console.log("Reloading Old Todo Items");
			const Table_of_items = process.env.TODOS_TABLE;
			const Client_of_doc: DocumentClient = new XAWS.DynamoDB.DocumentClient();
			const value = {
				TableName: Table_of_items,
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
			};
			const answer = await Client_of_doc.update(value).promise();
			console.log(answer);
			const attributes = answer.Attributes;
			return attributes as TodoUpdate;
	}
}

export class rmTodos_host {
	async rmTodos(content_id, id): Promise<string> {
			console.log("Queue Freeing Todo Items");
			const Table_of_items = process.env.TODOS_TABLE;
			const Client_of_doc: DocumentClient = new XAWS.DynamoDB.DocumentClient();
			const itemID = content_id;
			const selfID = id;
			const value = {
				TableName: Table_of_items,
				Key: {
					"userId": selfID,
					"todoId": itemID
				},
			};
			const answer = await Client_of_doc.delete(value).promise();
			console.log(answer);
			return "" as string;
	}
}

export class simUploadLink_host {
	async simUploadLink(content_id): Promise<string> {
			console.log("Uploading Target Link");
			const Database_client: Types = new XAWS.S3({ signatureVersion: 'v4' });
			const databaseName = process.env.S3_BUCKET_NAME;
			const itemID = content_id;
			const url_link = Database_client.getSignedUrl('putObject', {
				Bucket: databaseName,
				Key: itemID,
				Expires: 1000,
			});
			console.log(url_link);
			return url_link as string;
	}
}