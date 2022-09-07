import { APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { getUserId } from '../utils';
import { create_new_todo } from '../../helpers/todos'
import { parseUserId } from "../../auth/utils";


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
	const authorization = event.headers.Authorization
	const split = authorization.split(' ')
	const jwtToken = split[1]
	const token = parseUserId(jwtToken)
	const item7 = await create_new_todo(newTodo, token);
	console.log("Events are runnin on API's", event);
	return {
		statusCode: 201,
		headers: {
            'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({
		"item": item7}),
	}
	}
)


// handler.use(
  // cors({
    // credentials: true
  // })
// )
