import { NextResponse } from "next/server"
import rules from "./rules.json"

export async function GET() {
    return NextResponse.json(rules)
}
