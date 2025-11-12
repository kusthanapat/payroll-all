import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types ตรงกับ table ของคุณ
export interface Employee {
  id: number;
  employee_id: string;
  title_name: string;
  name: string;
  gender: string;
  nickname?: string | null;
  birth_date: string;
  mobile_phone: string;
  national_id: string;
  national_idcard_issue_date: string;
  national_idcard_expiry_date: string;
  national_idcard_issued_place: string;

  // ที่อยู่ตามทะเบียนบ้าน
  registered_house_no: string;
  registered_village: string;
  registered_soi: string;
  registered_road: string;
  registered_province: string;
  registered_district: string;
  registered_subdistrict: string;
  registered_postcode: string;
  // ที่อยู่ปัจจุบัน
  current_house_no: string;
  current_village: string;
  current_soi: string;
  current_road: string;
  current_province: string;
  current_district: string;
  current_subdistrict: string;
  current_postcode: string;

  // ครอบครัว
  marital_status: string;
  spouse_title_name: string;
  spouse_name: string;
  number_of_children: string;

  position: string;
  division: string;
  department: string;
  nationality: string;
  race: string;
  religion?: string | null;
  height: number;
  weight: number;
  bank_id?: string | null;
  bank_account_number?: string | null;
  tax_identification_number?: string | null;
  social_security_number?: string | null;
  provident_fund_number?: string | null;
  employee_type?: string | null;
  shift?: string | null;
  start_time?: string | null;
  start_lunch?: string | null;
  end_lunch?: string | null;
  end_time?: string | null;
  start_working_date: string;
  end_working_date: string;
  salary?: number | null;
  daily_wage?: number | null;
  hourly_wage?: number | null;
  company_provident_fund?: number | null;
  employee_provident_fund?: number | null;
  social_security_contribution?: number | null;
  life_insurance_premium?: number | null;
  housing_loan_interest?: number | null;
  teacher_fund?: number | null;
  rmf?: number | null;
  created_at?: string;
  updated_at?: string | null;
}
