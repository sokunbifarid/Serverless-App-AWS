import {TodoItem} from "../models/TodoItem";
import {parseUserId} from "../auth/utils";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";
import {TodoUpdate} from "../models/TodoUpdate";

import {syncTodos_host} from "./todosAccess";
import {newTodos_host} from "./todosAccess";
import {reloadTodos_host} from "./todosAccess";
import {rmTodos_host} from "./todosAccess";
import {simUploadLink_host} from "./todosAccess";


const uniqueIDV4 = require('uuid/v4');
const enableSyncTodos = new syncTodos_host();
const enableNewTodos = new newTodos_host();
const enableReloadTodos = new reloadTodos_host();
const enableRmTodos = new rmTodos_host();
const enableSimpleUploadLink = new simUploadLink_host();


export function simUploadLink(content_id): Promise<string> {
    return enableSimpleUploadLink.simUploadLink(content_id);
}

export function rmTodos(content_id, token): Promise<string> {
    const parseID = parseUserId(token);
    return enableRmTodos.rmTodos(content_id, parseID);
}

export function newTodos(request_event: CreateTodoRequest, token): Promise<TodoItem> {
    const parseID = parseUserId(token);
    const content_id =  uniqueIDV4();
    const dataBaseName = process.env.S3_BUCKET_NAME;
    
    return enableNewTodos.newTodos({
        userId: parseID,
        todoId: uniqueIDV4(),
        attachmentUrl:  `https://${dataBaseName}.s3.amazonaws.com/${content_id}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...request_event,
    });
}

export function reloadTodos(update_event : UpdateTodoRequest, content_id, token): Promise<TodoUpdate> {
    const parseID = parseUserId(token);
    return enableReloadTodos.reloadTodos(update_event, content_id, parseID);
}



export async function syncTodos(token): Promise<TodoItem[]> {
    const parseID = parseUserId(token);
    return enableSyncTodos.syncTodos(parseID);
}