//import { TodosAccess } from './todosAcess'
//import { createDynamoDBClient } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic
import { TodoUpdate } from '../models/TodoUpdate';
import { get_todo_items } from './todosAcess'
import { create_todo_items } from './todosAcess'
import { update_todo_items } from './todosAcess'
import { delete_todo_items } from './todosAcess'
import { get_upload_url } from './todosAcess'

const look_get_items = new get_todo_items();
const look_create_items = new create_todo_items();
const look_update_items = new update_todo_items();
const look_delete_items = new delete_todo_items();
const look_get_url = new get_upload_url();


export async function get_all_todo(token): 
	Promise<TodoItem[]> {
    return look_get_items.get_all_todo(token);
}

export function update_all_todo(
	updateTodoRequest: UpdateTodoRequest,
	content_id: string, token: string
	): Promise<TodoUpdate> {
    return look_update_items.update_all_todo(updateTodoRequest, content_id, token);
}

export async function create_new_todo(
  createTodoRequest: CreateTodoRequest,
  token: string): Promise<TodoItem> {
  const databaseBucket = process.env.S3_BUCKET_NAME
  return await look_create_items.create_new_todo({
    todoId: uuid,
    userId: token,
    attachmentUrl:  `https://${databaseBucket}.s3.amazonaws.com/${uuid}`, 
    createdAt: new Date().toISOString(),
	done: false,
	...createTodoRequest,
  })
}

export function delete_this_todo_item(content_id: string, token): Promise<string> {
    return look_delete_items.delete_this_todo_item(content_id, token);
}

export function get_required_link(content_id: string): Promise<string> {
    return look_get_url.get_required_link(content_id);
}