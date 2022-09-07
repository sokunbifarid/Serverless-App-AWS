import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { parseUserId } from "../../auth/utils";
//import { cors, httpErrorHandler } from 'middy/middlewares'

import { update_all_todo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Implement creating a new TODO item
	const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
	const authorization = event.headers.Authorization
	const split = authorization.split(' ')
	const jwtToken = split[1]
	const token = parseUserId(jwtToken)
	const items = await update_all_todo(updatedTodo, todoId, token);
	console.log("Events are runnin on API's", event);
	return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            "item": items
        }),
    }
  }
)


// handler
  // .use(httpErrorHandler())
  // .use(
    // cors({
      // credentials: true
    // })
  // )
