import { NextRequest, NextResponse } from "next/server";
import { getUserFromSession } from "./session";
import { NextApiResponse } from "next";

type ResponseData = {
    params: any 
}

export default (service: Function) => async (request: NextRequest, response: NextApiResponse<ResponseData>) => {
    try {  
        const user = await getUserFromSession(request);
        if (!user) throw new Error('User not authenticated!');
        return service(request, response, user);
    } catch (error: any) {
        return new NextResponse(JSON.stringify({
            status: "error",
            message: error?.message,
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
