import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { createUser, getUserByAddress, isUserRegistered } from "~~/services/database/repositories/users";
import { PlausibleEvent, trackPlausibleEvent } from "~~/services/plausible";

type RegisterAutomaticPayload = {
  address: string;
};

export async function POST(req: Request) {
  try {
    const { address } = (await req.json()) as RegisterAutomaticPayload;

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const userExist = await isUserRegistered(address);

    if (userExist) {
      // If user already exists, fetch and return them instead of throwing error
      const user = await getUserByAddress(address);
      return NextResponse.json({ user }, { status: 200 });
    }

    const user = await createUser({ userAddress: address });

    waitUntil(trackPlausibleEvent(PlausibleEvent.SIGNUP_SRE, {}, req));

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log("Error during automatic registration:", error);
    console.error("Error during automatic registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
