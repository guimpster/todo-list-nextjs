import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";

type ResponseData = {
    params: {
        projectId: string
    } 
}

const getAllProjects = async (request: NextRequest, response: ResponseData, user) => {
    const projects = await prisma.project.findMany({
        where: {
            userId: user.id,
        },
        include: { tasks: true },
    });

    return new NextResponse(JSON.stringify(projects), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

const createProject = async (request: NextRequest, response: ResponseData, user) => {
    const json = await request.json();

    const project = await prisma.project.create({
        data: {
            ...json,
            userId: user.id
        },
    });

    return new NextResponse(JSON.stringify({
        status: "success",
        data: {
            project,
        },
    }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
  };

  const getProjectById = async (request: NextRequest, response: ResponseData, user) => {
    const id = response.params.projectId;
    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id
      },
    });
  
    let json_response = {
      status: "success",
      data: {
        project,
      },
    };
    return NextResponse.json(json_response);
  }

  const patchProjectById = async (request: NextRequest, response: ResponseData, user) => {
    const id = response.params.projectId;
    let json = await request.json();

    const updated_project = await prisma.project.update({
        where: { 
            id,
            userId: user.id
        },
        data: json,
    });

    let json_response = {
        status: "success",
        data: {
            project: updated_project,
        },
    };
    return NextResponse.json(json_response);
    
  }

  const deleteProjectById = async (request: NextRequest, response: ResponseData, user) => {
    const id = response.params.projectId;

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id
        }
    });

    await prisma.task.deleteMany({
        where: {
            projectId: id
        }
    })

    await prisma.project.delete({
        where: { 
            id,
            userId: user.id
        },
    });

    return new NextResponse(null, { status: 204 });
  }
  
export { getAllProjects, createProject, getProjectById, patchProjectById, deleteProjectById };