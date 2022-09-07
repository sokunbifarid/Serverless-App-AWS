import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {syncTodos} from "../../helpers/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    const auth = event.headers.Authorization;
    const auth_body = auth.split(' ');
    const token = auth_body[1];
    const items = await syncTodos(token);
	console.log("Events running on API's ", event);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            "items": items,
        }),
    }
};
