import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function POST(request) {
  try {
    const { title, blog, catagory, image, nickname } = await request.json();

    if (!title || !blog || !catagory) {
      const response = new NextResponse(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
      response.headers.set("Access-Control-Allow-Origin", "*");
      return response;
    }

    const post = await prisma.post.create({
      data: { title, blog, catagory, image, nickname },
    });

    const response = new NextResponse(JSON.stringify(post), { status: 201 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  } catch (error) {
    console.log(error);
    const response = new NextResponse(
      JSON.stringify({
        error: "Error creating post",
        details: error.message,
      }),
      { status: 500 }
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    return response;
  }
}
