import { NextResponse } from "next/server";
import { getFullBackup } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";

export async function GET() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backup = await getFullBackup();

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="northfold-portfolio-backup-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
