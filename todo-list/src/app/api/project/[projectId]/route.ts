import authHandler from "../../../lib/authHandler";
import { deleteProjectById, getProjectById, patchProjectById } from "../../../lib/project";

const GET = authHandler(getProjectById);
const PATCH = authHandler(patchProjectById);
const DELETE = authHandler(deleteProjectById);

export {
  PATCH,
  GET,
  DELETE
}
