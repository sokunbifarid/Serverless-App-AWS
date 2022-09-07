import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import * as middy from 'middy'
//import { cors, httpErrorHandler } from 'middy/middlewares'

import { delete_this_todo_item } from '../../helpers/todos'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const rmItem = await delete_this_todo_item(todoId, getUserId);
	console.log("Events running on API's ", event);
	
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: rmItem,
    }
  }

// handler
  // .use(httpErrorHandler())
  // .use(
    // cors({
      // credentials: true
    // })
  // )
