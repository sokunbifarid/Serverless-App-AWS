import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
//import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'

import { get_required_link } from '../../helpers/todos'
//import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const target_link = await get_required_link(todoId);
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
  }
// handler
  // .use(httpErrorHandler())
  // .use(
    // cors({
      // credentials: true
    // })
  // )
