import authHandler from "../../lib/authHandler";
import { createTask, getAllTasks } from "../../lib/task";

const GET = authHandler(getAllTasks);
const POST = authHandler(createTask);

export {
  POST,
  GET
}
