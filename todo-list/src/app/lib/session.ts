import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";
import * as _ from 'lodash'

const getUserFromSession = async (request: NextRequest) => {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    const session = await prisma.session.findUnique({
        where: {
            sessionToken
        }
    });
    if (!session) throw Error('User not logged in!');

    const user = await prisma.user.findUnique({
        where: {
            id: session.userId
        }
    });
    if (!user) throw Error('User not logged in!');

    return _.omit(user, 'password');
}

const setUserOnSession = async (user) => {
    const session = await prisma.session.findUnique({
        where: {
            userId: user.id,
        }
    });

    if (session) {
        await prisma.session.update({
            where: {
               id: session.id,
            },
            data: {
                expires: new Date(new Date().getTime()+3*1000*60*60*24)
            }
        });
        return getResponse(session.sessionToken);
    }

    const sessionToken = crypto.randomBytes(16).toString('base64');
    await prisma.session.create({
        data: {
            sessionToken,
            expires: new Date(new Date().getTime()+3*1000*60*60*24),
            userId: user.id
        }
    });
    return getResponse(sessionToken);
}

const getResponse = (sessionToken: string) => {
    const response = new NextResponse(JSON.stringify({ sessionToken }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
    response.cookies.set('sessionToken', sessionToken)
    return response
}

export { getUserFromSession, setUserOnSession };