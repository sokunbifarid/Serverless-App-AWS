import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {rmTodos} from "../../helpers/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    const auth = event.headers.Authorization;
    const auth_body = auth.split(' ');
    const toekn = auth_body[1];
    const todo_param = event.pathParameters.todoId;
    const rmItem = await rmTodos(todo_param, toekn);
	console.log("Events running on API's ", event);
	
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: rmItem,
    }
};
