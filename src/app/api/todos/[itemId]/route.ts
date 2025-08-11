import { removeById } from "@/lib/todoStore";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ itemId: string }>;

interface RouteParams {
  params: Params;
}
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { itemId } = await params;
  const id = Number(itemId);

  if (!itemId || Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Missing or invalid 'id' param" },
      { status: 400 }
    );
  }

  const result = removeById(id);

  if (result === undefined) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}
