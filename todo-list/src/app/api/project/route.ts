import authHandler from "../../lib/authHandler";
import { createProject, getAllProjects } from "../../lib/project";

const GET = authHandler(getAllProjects);
const POST = authHandler(createProject);

export {
  POST,
  GET
}


