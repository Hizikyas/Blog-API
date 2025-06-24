// app/api/posts/route.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
// GET all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, blog, catagory, image, nickname } = await request.json();

    if (!title || !blog || !catagory || !image) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: { title, blog, catagory, image, nickname },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error creating post",
        details: error.message, // No Error type checking
      },
      { status: 500 }
    );
  }
}
