import { getUserFromSession } from "@/app/lib/session";
import prisma from "../../lib/prisma";
import argon2 from "argon2";
import * as _ from "lodash"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromSession(request)

    let json_response = {
      status: "success",
      data: {
          user: _.omit(user, 'password'),
      },
    };
    return new NextResponse(JSON.stringify(json_response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    let error_response = {
      status: "error",
      message: error.message,
    };
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: Request) {
    try {
      const json = await request.json();

      const existingUser = await prisma.user.findUnique({
        where: {
          email: json.email
        }
      });

      if (existingUser) return new NextResponse(JSON.stringify({ message: 'User already registered!'}), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
  
      const user = await prisma.user.create({
        data: {
          ...json,
          password: await argon2.hash(json.password)
        },
      });
  
      let json_response = {
        status: "success",
        data: {
            user: _.omit(user, 'password'),
        },
      };
      return new NextResponse(JSON.stringify(json_response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      let error_response = {
        status: "error",
        message: error.message,
      };
      return new NextResponse(JSON.stringify(error_response), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  