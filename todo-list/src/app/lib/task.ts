import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";

type ResponseData = {
    params: {
        taskId: string
    }
}

const getAllTasks = async (request: NextRequest, response: ResponseData, user) => {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId") || ''

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id: projectId
        }
    });

    const tasks = await prisma.task.findMany({
        where: {
            projectId
        }
    });

    return new NextResponse(JSON.stringify(tasks), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
}

const createTask = async (request: NextRequest, response: ResponseData, user) => {
    const json = await request.json();

    const projectId = json.projectId;

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id: projectId
        }
    });

    const task = await prisma.task.create({
        data: {
            ...json,
            projectId
        },
    });

    return new NextResponse(JSON.stringify({
        status: "success",
        data: {
            task,
        },
    }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
  };

  const getTaskById = async (request: NextRequest, response: ResponseData, user) => {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId") || ''
    const id = response.params.taskId;

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id: projectId
        }
    });

    const task = await prisma.task.findUnique({
      where: {
        id,
        projectId
      },
    });
  
    const json_response = {
      status: "success",
      data: {
        task,
      },
    };
    return NextResponse.json(json_response);
  }

  const patchTaskById = async (request: NextRequest, response: ResponseData, user) => {
    const json = await request.json();

    const projectId = json.projectId;
    const id = response.params.taskId;

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id: projectId
        }
    });

    const updated_task = await prisma.task.update({
        where: { 
            id,
            projectId
        },
        data: json,
    });

    const json_response = {
        status: "success",
        data: {
        task: updated_task,
        },
    };
    return NextResponse.json(json_response);
    
  }

  const deleteTaskById = async (request: NextRequest, response: ResponseData, user) => {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId") || ''
    
    const id = response.params.taskId;

    await prisma.project.findUniqueOrThrow({
        where: {
            userId: user.id,
            id: projectId
        }
    });

    await prisma.task.delete({
        where: { 
            id,
            projectId
        },
    });

    return new NextResponse(null, { status: 204 });
  }
  
export { getAllTasks, createTask, getTaskById, patchTaskById, deleteTaskById };