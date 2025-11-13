import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Unified parsing functions
const parse = {
  float: (v: any): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  },
  floatSmall: (v: any): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  },
  int: (v: any): number | null => {
    if (v === null || v === undefined || v === "") return null;
    const n = parseInt(v);
    return isNaN(n) ? null : n;
  },
  string: (v: any): string =>
    v === null || v === undefined ? "" : String(v).trim(),
  stringNull: (v: any): string | null => {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  },
  date: (v: any): string | null => {
    if (!v || v === "") return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  },
};

// Field configuration for parsing
const FIELD_CONFIG = {
  string: [
    "employee_id",
    "title_name",
    "name",
    "nickname",
    "gender",
    "mobile_phone",
    "line_id",
    "national_idcard_issued_place",
    "nationality",
    "race",
    "religion",
    "marital_status",
    "spouse_title_name",
    "spouse_name",
    "emergency_contact_name",
    "emergency_contact_relation",
    "emergency_contact_phone",
    "position",
    "division",
    "department",
    "employee_type",
    "shift",
    "bank_id",
    "bank_account_number",
    "working_status",
    "registered_house_no",
    "registered_village",
    "registered_soi",
    "registered_road",
    "registered_subdistrict",
    "registered_district",
    "registered_province",
    "registered_postcode",
    "current_house_no",
    "current_village",
    "current_soi",
    "current_road",
    "current_subdistrict",
    "current_district",
    "current_province",
    "current_postcode",
  ],
  stringNull: [
    "national_id",
    "tax_identification_number",
    "social_security_number",
    "provident_fund_number",
    "studentloan_number",
    "retirement_mutual_fund_number",
    "rmf_number",
    "life_insurance_number",
  ],
  date: [
    "birth_date",
    "national_idcard_issue_date",
    "national_idcard_expiry_date",
    "start_working_date",
    "end_working_date",
    "start_time",
    "start_lunch",
    "end_lunch",
    "end_time",
    "providentfund_entry_date",
    "providentfund_issuance_date",
  ],
  float: [
    "salary",
    "daily_wage",
    "hourly_wage",
    "social_security_contribution",
    "company_provident_fund",
    "employee_provident_fund",
    "student_loan_deduction",
    "retirement_mutual_fund_deduction",
    "rmf_deduction",
    "life_insurance_premium",
    "housing_loan_interest",
  ],
  int: ["number_of_children", "children_in_school", "children_notin_school"],
  floatSmall: ["height", "weight"],
};

export async function POST(request: NextRequest) {
  try {
    const { employees } = await request.json();

    if (!employees || !Array.isArray(employees)) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Fetch existing employees
    const { data: existingEmployees, error: fetchError } = await supabase
      .from("employees")
      .select("employee_id, name, national_id");

    if (fetchError) {
      console.error("Fetch error:", fetchError);
      return NextResponse.json(
        { success: false, error: "ไม่สามารถตรวจสอบข้อมูลได้" },
        { status: 500 }
      );
    }

    // Create lookup sets for better performance
    const existing = {
      ids: new Set(existingEmployees?.map((e) => e.employee_id) || []),
      names: new Set(existingEmployees?.map((e) => e.name.toLowerCase()) || []),
      nationalIds: new Set(
        existingEmployees
          ?.map((e) => e.national_id)
          .filter((id) => id?.trim()) || []
      ),
    };

    const newEmployees: any[] = [];
    const skippedEmployees: any[] = [];

    employees.forEach((emp: any) => {
      // Check for duplicates
      const isDupId = existing.ids.has(emp.employee_id);
      const isDupName = existing.names.has(emp.name?.toLowerCase());
      const hasNationalId =
        emp.national_id && String(emp.national_id).trim() !== "";
      const isDupNationalId =
        hasNationalId &&
        existing.nationalIds.has(String(emp.national_id).trim());

      if (isDupId || isDupName || isDupNationalId) {
        const reasons = [];
        if (isDupId) reasons.push("รหัส");
        if (isDupName) reasons.push("ชื่อ");
        if (isDupNationalId) reasons.push("เลขบัตรประชาชน");

        skippedEmployees.push({
          employee_id: emp.employee_id,
          name: emp.name,
          national_id: emp.national_id || "-",
          reason: `${reasons.join("และ")}ซ้ำ`,
        });
      } else {
        // Parse employee data using configuration
        const parsed: any = {};

        Object.entries(FIELD_CONFIG).forEach(([type, fields]) => {
          (fields as string[]).forEach((field) => {
            if (emp[field] !== undefined) {
              const parseFunc = parse[type as keyof typeof parse];
              parsed[field] = parseFunc(emp[field]);
            }
          });
        });

        newEmployees.push(parsed);
      }
    });

    let insertedCount = 0;
    if (newEmployees.length > 0) {
      const { error: insertError } = await supabase
        .from("employees")
        .insert(newEmployees);

      if (insertError) {
        console.error("Insert error:", insertError);
        return NextResponse.json(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }

      insertedCount = newEmployees.length;
    }

    return NextResponse.json({
      success: true,
      inserted: insertedCount,
      skipped: skippedEmployees,
      total: employees.length,
      message: `นำเข้าข้อมูลสำเร็จ ${insertedCount} รายการ${
        skippedEmployees.length > 0
          ? `, ข้าม ${skippedEmployees.length} รายการ`
          : ""
      }`,
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
