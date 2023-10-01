import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import argon2 from "argon2";
import * as _ from "lodash";
import { setUserOnSession } from "./session";

const loginUser = async (request: NextRequest) => {
    const json = await request.json();

    const user = await prisma.user.findUnique({
        where: {
            email: json.email,
        }
    });
    if (!user) return new NextResponse(JSON.stringify({ message: 'Invalid user/password!'}), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });

    const passwordMatch = await argon2.verify(
        user.password,
        json.password
    );
    if (!passwordMatch) return new NextResponse(JSON.stringify({ message: 'Invalid user/password!'}), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });

    return setUserOnSession(user);
}

const logoutUser = async (request: NextRequest) => {
    const sessionToken = request.cookies.get('sessionToken')?.value;   

    const session = await prisma.session.findUnique({
        where: {
            sessionToken
        }
    });
    if (!session) throw new Error('User not logged in!');

    await prisma.session.update({
        where: {
           id: session.id,
        },
        data: {
            expires: new Date()
        }
    });
    const response = new NextResponse(JSON.stringify({ message: 'User successfully logged out' }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
    response.cookies.set('sessionToken', '')
    return response;
}

export { loginUser, logoutUser };