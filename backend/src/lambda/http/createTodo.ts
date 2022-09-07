import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {newTodos} from "../../helpers/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    const auth = event.headers.Authorization;
    const auth_body = auth.split(' ');
    const token = auth_body[1];
    const todo_parsed: CreateTodoRequest = JSON.parse(event.body);
    const uniqueitem = await newTodos(todo_parsed, token);
	console.log("Events running on API's ", event);
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            "item": uniqueitem
        }),
    }
};
