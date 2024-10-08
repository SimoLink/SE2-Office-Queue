import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

// Example
export async function getUsers() {
  try {
    const user = await db.user.findMany();

    console.log({ user });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
