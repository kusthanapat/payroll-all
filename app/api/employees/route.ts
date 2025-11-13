import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST Data
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.employee_id || !data.name || !data.national_id) {
      return NextResponse.json(
        {
          success: false,
          error: "กรุณากรอกข้อมูลที่จำเป็น: รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน",
        },
        { status: 400 }
      );
    }

    const { data: existingEmployee } = await supabase
      .from("employees")
      .select("employee_id")
      .eq("employee_id", data.employee_id)
      .single();

    if (existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          error: "รหัสพนักงานนี้มีอยู่ในระบบแล้ว",
        },
        { status: 409 }
      );
    }

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
        message: "เพิ่มข้อมูลพนักงานสำเร็จ",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
      },
      { status: 500 }
    );
  }
}

// GET Data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const employeeId = searchParams.get("employee_id");
    const name = searchParams.get("name");
    const search = searchParams.get("search");
    const department = searchParams.get("department");
    const division = searchParams.get("division");
    const position = searchParams.get("position");

    let query = supabase.from("employees").select("*");

    if (id) {
      query = query.eq("id", id);
      const { data, error } = await query.single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            {
              success: false,
              error: "ไม่พบข้อมูลพนักงาน",
            },
            { status: 404 }
          );
        }
        throw error;
      }

      return NextResponse.json({
        success: true,
        data: data,
      });
    } else if (employeeId) {
      query = query.eq("employee_id", employeeId);
      const { data, error } = await query.single();

      if (error) {
        if (error.code === "PGRST116") {
          return NextResponse.json(
            {
              success: false,
              error: "ไม่พบข้อมูลพนักงาน",
            },
            { status: 404 }
          );
        }
        throw error;
      }

      return NextResponse.json({
        success: true,
        data: data,
      });
    } else if (name) {
      query = query.ilike("name", `%${name}%`);
    } else if (department) {
      query = query.ilike("department", `%${department}%`);
    } else if (division) {
      query = query.ilike("division", `%${division}%`);
    } else if (position) {
      query = query.ilike("position", `%${position}%`);
    } else if (search) {
      query = query.or(
        `name.ilike.%${search}%,` +
          `employee_id.ilike.%${search}%,` +
          `position.ilike.%${search}%,` +
          `division.ilike.%${search}%,` +
          `department.ilike.%${search}%`
      );
    }

    query = query.order("employee_id", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0,
    });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
      },
      { status: 500 }
    );
  }
}

// PUT Data
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบ ID ของพนักงาน",
        },
        { status: 400 }
      );
    }

    const { data: existingEmployee } = await supabase
      .from("employees")
      .select("id")
      .eq("id", id)
      .single();

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบข้อมูลพนักงาน",
        },
        { status: 404 }
      );
    }

    if (updateData.employee_id) {
      const { data: duplicateCheck } = await supabase
        .from("employees")
        .select("id")
        .eq("employee_id", updateData.employee_id)
        .neq("id", id)
        .single();

      if (duplicateCheck) {
        return NextResponse.json(
          {
            success: false,
            error: "รหัสพนักงานนี้มีอยู่ในระบบแล้ว",
          },
          { status: 409 }
        );
      }
    }

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
      message: "อัปเดตข้อมูลพนักงานสำเร็จ",
    });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล",
      },
      { status: 500 }
    );
  }
}

// DELETE Data
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบ ID ของพนักงาน",
        },
        { status: 400 }
      );
    }

    const { data: existingEmployee } = await supabase
      .from("employees")
      .select("id, employee_id, name")
      .eq("id", id)
      .single();

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบข้อมูลพนักงาน",
        },
        { status: 404 }
      );
    }

    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `ลบข้อมูลพนักงาน ${existingEmployee.employee_id} - ${existingEmployee.name} สำเร็จ`,
    });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
      },
      { status: 500 }
    );
  }
}
