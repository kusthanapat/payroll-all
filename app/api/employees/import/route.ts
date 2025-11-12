import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ฟังก์ชันช่วยแปลงค่าให้ถูกต้อง
const parseFloat8 = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseFloat4 = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseInt4 = (value: any): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

const parseString = (value: any): string => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const parseStringNullable = (value: any): string | null => {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str === "" ? null : str;
};

const parseDate = (value: any): string | null => {
  if (!value || value === "") return null;
  const str = String(value).trim();
  return str === "" ? null : str;
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

    // ดึงข้อมูลพนักงานทั้งหมดที่มีอยู่แล้วใน database
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

    // สร้าง Set เพื่อเช็คข้อมูลซ้ำได้เร็วขึ้น
    const existingEmployeeIds = new Set(
      existingEmployees?.map((emp) => emp.employee_id) || []
    );
    const existingEmployeeNames = new Set(
      existingEmployees?.map((emp) => emp.name.toLowerCase()) || []
    );
    const existingNationalIds = new Set(
      existingEmployees
        ?.map((emp) => emp.national_id)
        .filter((id) => id && id.trim() !== "") || []
    );

    // แยกข้อมูลออกเป็น 2 กลุ่ม: ใหม่ และ ซ้ำ
    const newEmployees: any[] = [];
    const skippedEmployees: any[] = [];

    employees.forEach((emp: any) => {
      const isDuplicateId = existingEmployeeIds.has(emp.employee_id);
      const isDuplicateName = existingEmployeeNames.has(emp.name.toLowerCase());

      // เช็คเลขบัตรประชาชนซ้ำเฉพาะตอนที่มีค่า (ไม่ใช่ค่าว่าง)
      const hasNationalId =
        emp.national_id && String(emp.national_id).trim() !== "";
      const isDuplicateNationalId =
        hasNationalId &&
        existingNationalIds.has(String(emp.national_id).trim());

      if (isDuplicateId || isDuplicateName || isDuplicateNationalId) {
        // ข้อมูลซ้ำ - ข้าม
        let reason = "";
        if (isDuplicateId && isDuplicateName && isDuplicateNationalId) {
          reason = "รหัส, ชื่อ และเลขบัตรประชาชนซ้ำ";
        } else if (isDuplicateId && isDuplicateName) {
          reason = "รหัสและชื่อซ้ำ";
        } else if (isDuplicateId && isDuplicateNationalId) {
          reason = "รหัสและเลขบัตรประชาชนซ้ำ";
        } else if (isDuplicateName && isDuplicateNationalId) {
          reason = "ชื่อและเลขบัตรประชาชนซ้ำ";
        } else if (isDuplicateId) {
          reason = "รหัสซ้ำ";
        } else if (isDuplicateName) {
          reason = "ชื่อซ้ำ";
        } else if (isDuplicateNationalId) {
          reason = "เลขบัตรประชาชนซ้ำ";
        }

        skippedEmployees.push({
          employee_id: emp.employee_id,
          name: emp.name,
          national_id: emp.national_id || "-",
          reason: reason,
        });
      } else {
        // ข้อมูลใหม่ - เพิ่มลง database
        newEmployees.push({
          // Personal Data
          employee_id: parseString(emp.employee_id),
          title_name: parseString(emp.title_name),
          name: parseString(emp.name),
          nickname: parseString(emp.nickname),
          gender: parseString(emp.gender),
          birth_date: parseDate(emp.birth_date),
          mobile_phone: parseString(emp.mobile_phone),
          national_id: parseStringNullable(emp.national_id),
          national_idcard_issue_date: parseDate(emp.national_idcard_issue_date),
          national_idcard_expiry_date: parseDate(
            emp.national_idcard_expiry_date
          ),
          national_idcard_issued_place: parseString(
            emp.national_idcard_issued_place
          ),
          nationality: parseString(emp.nationality),
          race: parseString(emp.race),
          religion: parseString(emp.religion),
          height: parseFloat4(emp.height),
          weight: parseFloat4(emp.weight),

          // Family
          marital_status: parseString(emp.marital_status),
          spouse_title_name: parseString(emp.spouse_title_name),
          spouse_name: parseString(emp.spouse_name),
          number_of_children: parseInt4(emp.number_of_children),

          // Emergency Contact
          emergency_contact_name: parseString(emp.emergency_contact_name),
          emergency_contact_relation: parseString(
            emp.emergency_contact_relation
          ),
          emergency_contact_phone: parseString(emp.emergency_contact_phone),

          // Work Detail
          position: parseString(emp.position),
          division: parseString(emp.division),
          department: parseString(emp.department),
          employee_type: parseString(emp.employee_type),
          start_working_date: parseDate(emp.start_working_date),
          end_working_date: parseDate(emp.end_working_date),
          start_time: parseDate(emp.start_time),
          start_lunch: parseDate(emp.start_lunch),
          end_lunch: parseDate(emp.end_lunch),
          end_time: parseDate(emp.end_time),
          salary: parseFloat8(emp.salary),
          daily_wage: parseFloat8(emp.daily_wage),
          hourly_wage: parseFloat8(emp.hourly_wage),

          // Bank & Tax
          bank_id: parseString(emp.bank_id),
          bank_account_number: parseString(emp.bank_account_number),
          tax_identification_number: parseStringNullable(
            emp.tax_identification_number
          ),
          social_security_number: parseStringNullable(
            emp.social_security_number
          ),
          provident_fund_number: parseStringNullable(emp.provident_fund_number),
          studentloan_number: parseStringNullable(emp.studentloan_number),
          retirement_mutual_fund_number: parseStringNullable(
            emp.retirement_mutual_fund_number
          ),
          rmf_number: parseStringNullable(emp.rmf_number),
          life_insurance_number: parseStringNullable(emp.life_insurance_number),

          // Money/Deductions
          social_security_contribution: parseFloat8(
            emp.social_security_contribution
          ),
          company_provident_fund: parseFloat8(emp.company_provident_fund),
          employee_provident_fund: parseFloat8(emp.employee_provident_fund),
          student_loan_deduction: parseFloat8(emp.student_loan_deduction),
          retirement_mutual_fund_deduction: parseFloat8(
            emp.retirement_mutual_fund_deduction
          ),
          rmf_deduction: parseFloat8(emp.rmf_deduction),
          life_insurance_premium: parseFloat8(emp.life_insurance_premium),
          housing_loan_interest: parseFloat8(emp.housing_loan_interest),

          // Registered Address
          registered_house_no: parseString(emp.registered_house_no),
          registered_village: parseString(emp.registered_village),
          registered_soi: parseString(emp.registered_soi),
          registered_road: parseString(emp.registered_road),
          registered_subdistrict: parseString(emp.registered_subdistrict),
          registered_district: parseString(emp.registered_district),
          registered_province: parseString(emp.registered_province),
          registered_postcode: parseString(emp.registered_postcode),

          // Current Address
          current_house_no: parseString(emp.current_house_no),
          current_village: parseString(emp.current_village),
          current_soi: parseString(emp.current_soi),
          current_road: parseString(emp.current_road),
          current_subdistrict: parseString(emp.current_subdistrict),
          current_district: parseString(emp.current_district),
          current_province: parseString(emp.current_province),
          current_postcode: parseString(emp.current_postcode),
        });
      }
    });

    // บันทึกเฉพาะข้อมูลใหม่
    let insertedCount = 0;
    if (newEmployees.length > 0) {
      const { data, error: insertError } = await supabase
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
