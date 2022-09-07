import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
//import * as middy from 'middy'
//import { cors } from 'middy/middlewares'

import { get_all_todo } from '../../helpers/todos'
import { getUserId } from '../utils';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all TODO items for a current user
    // Write your code here
    const items = await get_all_todo(getUserId);
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
  }

// handler.use(
  // cors({
    // credentials: true
  // })
// )