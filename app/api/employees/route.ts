import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST - เพิ่มพนักงาน
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const { data: result, error } = await supabase
      .from("employees")
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET - ดึงข้อมูลพนักงาน
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const employeeId = searchParams.get("employee_id");
    const name = searchParams.get("name");
    const search = searchParams.get("search");

    let query = supabase.from("employees").select("*");

    // ถ้ามี id ให้ค้นหาจาก id (สำหรับแก้ไขข้อมูล)
    if (id) {
      query = query.eq("id", id);
    }
    // ถ้ามี employee_id ให้ค้นหาจาก employee_id
    else if (employeeId) {
      query = query.eq("employee_id", employeeId);
    }
    // ถ้ามี name ให้ค้นหาจากชื่อ
    else if (name) {
      query = query.ilike("name", `%${name}%`);
    }
    // ถ้ามี search ให้ค้นหาทั้งจากชื่อและรหัสพนักงาน
    else if (search) {
      query = query.or(
        `name.ilike.%${search}%,` +
          `employee_id.ilike.%${search}%,` +
          `position.ilike.%${search}%,` +
          `division.ilike.%${search}%,` +
          `department.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูล
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const { data: result, error } = await supabase
      .from("employees")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูล
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
