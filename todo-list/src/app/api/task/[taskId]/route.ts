import authHandler from "../../../lib/authHandler";
import { deleteTaskById, getTaskById, patchTaskById } from "../../../lib/task";

const GET = authHandler(getTaskById);
const PATCH = authHandler(patchTaskById);
const DELETE = authHandler(deleteTaskById);

export {
  PATCH,
  GET,
  DELETE
}