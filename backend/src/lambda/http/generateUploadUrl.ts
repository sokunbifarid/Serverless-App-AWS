import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {simUploadLink} from "../../helpers/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const todo_param = event.pathParameters.todoId;
    const target_link = await simUploadLink(todo_param);
	console.log("Events running on API's ", event);
    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            uploadUrl: target_link,
        })
    };
};