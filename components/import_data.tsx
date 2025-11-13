"use client";

import React, { useState, useCallback } from "react";
import {
  X,
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import ExcelJS from "exceljs";

interface ImportDataProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

interface ImportedEmployee {
  employee_id: string;
  title_name?: string;
  name: string;
  nickname?: string;
  gender?: string;
  birth_date?: string;
  mobile_phone?: string;
  line_id?: string;
  national_id?: string;
  national_idcard_issue_date?: string;
  national_idcard_expiry_date?: string;
  national_idcard_issued_place?: string;
  nationality?: string;
  race?: string;
  religion?: string;
  height?: number;
  weight?: number;
  marital_status?: string;
  spouse_title_name?: string;
  spouse_name?: string;
  number_of_children?: number;
  children_in_school?: number;
  children_notin_school?: number;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_phone?: string;
  position?: string;
  division?: string;
  department?: string;
  shift?: string;
  employee_type?: string;
  start_working_date?: string;
  end_working_date?: string;
  start_time?: string;
  start_lunch?: string;
  end_lunch?: string;
  end_time?: string;
  working_status?: string;
  salary?: number;
  daily_wage?: number;
  hourly_wage?: number;
  bank_id?: string;
  bank_account_number?: string;
  tax_identification_number?: string;
  social_security_number?: string;
  provident_fund_number?: string;
  providentfund_entry_date?: string;
  providentfund_issuance_date?: string;
  studentloan_number?: string;
  retirement_mutual_fund_number?: string;
  rmf_number?: string;
  life_insurance_number?: string;
  social_security_contribution?: number;
  company_provident_fund?: number;
  employee_provident_fund?: number;
  student_loan_deduction?: number;
  retirement_mutual_fund_deduction?: number;
  rmf_deduction?: number;
  life_insurance_premium?: number;
  housing_loan_interest?: number;
  registered_house_no?: string;
  registered_village?: string;
  registered_soi?: string;
  registered_road?: string;
  registered_subdistrict?: string;
  registered_district?: string;
  registered_province?: string;
  registered_postcode?: string;
  current_house_no?: string;
  current_village?: string;
  current_soi?: string;
  current_road?: string;
  current_subdistrict?: string;
  current_district?: string;
  current_province?: string;
  current_postcode?: string;
}

// Template configuration
const TEMPLATE_CONFIG = {
  personal_data: {
    headers: [
      "รหัสพนักงาน",
      "คำนำหน้าชื่อ",
      "ชื่อ-นามสกุล",
      "ชื่อเล่น",
      "เพศ",
      "วันเกิด",
      "มือถือ",
      "LineID",
      "เลขประชาชน",
      "วันที่ออกบัตร",
      "วันหมดอายุบัตร",
      "สถานที่ออกบัตร",
      "สัญชาติ",
      "เชื้อชาติ",
      "ศาสนา",
      "ส่วนสูง",
      "น้ำหนัก",
      "สถานะภาพ",
      "คำนำหน้าชื่อคู่สมรส",
      "ชื่อ-นามสกุลคู่สมรส",
      "จำนวนบุตร",
      "จำนวนบุตรที่เรียนอยู่",
      "จำนวนบุตรที่ศึกษาต่างประเทศหรือไม่ได้เรียน",
      "ชื่อ-สกุลผู้ติดต่อฉุกเฉิน",
      "ความสัมพันธ์ผู้ติดต่อฉุกเฉิน",
      "เบอร์โทรผู้ติดต่อฉุกเฉิน",
    ],
    example: [
      "20000000",
      "นาย",
      "ตัวอย่าง สมมติ",
      "มาโนช",
      "ชาย",
      "1920-01-31",
      "0999999999",
      "line_id_example",
      "1111111111235",
      "2024-01-31",
      "2030-01-31",
      "สำนักงานเขตกรุงเทพ",
      "ไทย",
      "ไทย",
      "พุทธ",
      170,
      60,
      "สมรส",
      "นาง",
      "มานี มานะ",
      1,
      1,
      0,
      "มานี มานะ",
      "ภรรยา",
      "0888888888",
    ],
    dateFields: ["วันเกิด", "วันที่ออกบัตร", "วันหมดอายุบัตร"],
    numFields: [
      "ส่วนสูง",
      "น้ำหนัก",
      "จำนวนบุตร",
      "จำนวนบุตรที่เรียนอยู่",
      "จำนวนบุตรที่ศึกษาต่างประเทศหรือไม่ได้เรียน",
    ],
  },
  personal_work_detail: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "ตำแหน่ง",
      "ฝ่าย",
      "แผนก",
      "กะ",
      "ประเภทพนักงาน",
      "วันที่เริ่มงาน",
      "วันที่ออกงาน",
      "เวลาเริ่มทำงาน",
      "เวลาเริ่มพัก",
      "หมดเวลาพัก",
      "เวลาออกงาน",
      "เงินเดือน",
      "เงินรายวัน",
      "เงินรายชั่วโมง",
      "สถานะการทำงาน",
    ],
    example: [
      "20000000",
      "ตัวอย่าง สมมติ",
      "ช่าง",
      "001",
      "001",
      "1",
      "ประจำ",
      "2025-07-01",
      null,
      "08:00",
      "12:00",
      "13:00",
      "17:00",
      20000.0,
      1000.0,
      125.0,
      "ปกติ",
    ],
    dateFields: ["วันที่เริ่มงาน", "วันที่ออกงาน"],
    timeFields: ["เวลาเริ่มทำงาน", "เวลาเริ่มพัก", "หมดเวลาพัก", "เวลาออกงาน"],
    moneyFields: ["เงินเดือน", "เงินรายวัน", "เงินรายชั่วโมง"],
  },
  personal_tax: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "รหัสธนาคาร",
      "เลขที่บัญชี",
      "เลขประจำตัวผู้เสียภาษี",
      "เลขประกันสังคม",
      "เลขกองทุนสำรองเลี้ยงชีพ",
      "วันเข้ากองทุนสำรองเลี้ยงชีพ",
      "วันออกกองทุนสำรองเลี้ยงชีพ",
      "เลข_กยศ",
      "เลข_ภงด_91",
      "เลข_rmf",
      "เลขประกันชีวิต",
    ],
    example: [
      "20000000",
      "ตัวอย่าง สมมติ",
      "004",
      "9999999999",
      "111111123456",
      "111222333444",
      "444555666777",
      "2025-07-01",
      null,
      null,
      null,
      null,
      null,
    ],
    dateFields: ["วันเข้ากองทุนสำรองเลี้ยงชีพ", "วันออกกองทุนสำรองเลี้ยงชีพ"],
  },
  personal_money: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "หักประกันสังคม",
      "กองทุนสำรองเลี้ยงชีพ(บริษัทสมทบ)",
      "กองทุนสำรองเลี้ยงชีพ(พนักงานสมทบ)",
      "หัก_กยศ",
      "หัก_ภงด_91",
      "หัก_rmf",
      "หักเบี้ยประกันชีวิต",
      "หักดอกเบี้ยเงินกู้ที่อยู่อาศัย",
    ],
    example: [
      "20000000",
      "ตัวอย่าง สมมติ",
      750.0,
      1000.0,
      1000.0,
      null,
      null,
      null,
      null,
      null,
    ],
    moneyFields: [
      "หักประกันสังคม",
      "กองทุนสำรองเลี้ยงชีพ(บริษัทสมทบ)",
      "กองทุนสำรองเลี้ยงชีพ(พนักงานสมทบ)",
      "หัก_กยศ",
      "หัก_ภงด_91",
      "หัก_rmf",
      "หักเบี้ยประกันชีวิต",
      "หักดอกเบี้ยเงินกู้ที่อยู่อาศัย",
    ],
  },
  personal_registered_address: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "บ้านเลขที่",
      "หมู่ที่/หมู่บ้าน",
      "ซอย",
      "ถนน",
      "แขวง/ตำบล",
      "เขต/อำเภอ",
      "จังหวัด",
      "รหัสไปรษณีย์",
    ],
    example: [
      "20000000",
      "ตัวอย่าง สมมติ",
      "100",
      "5",
      null,
      null,
      "บางซื่อ",
      "บางซื่อ",
      "กรุงเทพมหานคร",
      "10800",
    ],
  },
  personal_current_address: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "บ้านเลขที่",
      "หมู่ที่/หมู่บ้าน",
      "ซอย",
      "ถนน",
      "แขวง/ตำบล",
      "เขต/อำเภอ",
      "จังหวัด",
      "รหัสไปรษณีย์",
    ],
    example: [
      "20000000",
      "ตัวอย่าง สมมติ",
      "100",
      "5",
      null,
      null,
      "บางซื่อ",
      "บางซื่อ",
      "กรุงเทพมหานคร",
      "10800",
    ],
  },
  fifty_tawi: {
    headers: [
      "รหัสพนักงาน",
      "ชื่อ-นามสกุล",
      "เลขประจำตัวผู้เสียภาษี",
      "เลข_50ทวิ",
    ],
    example: ["20000000", "ตัวอย่าง สมมติ", "111111123456", "456789895425"],
  },
};

// Download Excel template
export const downloadTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  const formats = {
    date: "yyyy-mm-dd",
    time: "hh:mm",
    num0: "#,##0",
    num2: "#,##0.00",
  };

  Object.entries(TEMPLATE_CONFIG).forEach(([sheetName, config]) => {
    const sheet = workbook.addWorksheet(sheetName);
    sheet.addRows([config.headers, config.example]);

    sheet.addTable({
      name: `${sheetName}_table`,
      ref: "A1",
      headerRow: true,
      style: { theme: "TableStyleMedium2", showRowStripes: true },
      columns: config.headers.map((h) => ({ name: h, filterButton: true })),
      rows: [config.example],
    });

    const setFormat = (fields: string[], format: string) => {
      fields?.forEach((field) => {
        const idx = config.headers.indexOf(field);
        if (idx >= 0) sheet.getColumn(idx + 1).numFmt = format;
      });
    };

    setFormat(config.dateFields || [], formats.date);
    setFormat(config.timeFields || [], formats.time);
    setFormat(config.numFields || [], formats.num0);
    setFormat(config.moneyFields || [], formats.num2);

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    sheet.columns.forEach((col) => (col.width = 20));
    sheet.views = [{ state: "frozen", ySplit: 1 }];
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: "employee_full_template.xlsx",
  });
  link.click();
};

// Utility functions
const formatExcelDate = (value: any): string => {
  if (!value) return "";
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
      date.d
    ).padStart(2, "0")}`;
  }
  if (typeof value === "string") {
    const ddmmyyyy = value.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (ddmmyyyy)
      return `${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(
        2,
        "0"
      )}-${ddmmyyyy[1].padStart(2, "0")}`;

    const yyyymmdd = value.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (yyyymmdd)
      return `${yyyymmdd[1]}-${yyyymmdd[2].padStart(
        2,
        "0"
      )}-${yyyymmdd[3].padStart(2, "0")}`;
  }
  return String(value);
};

const formatExcelTime = (value: any): string => {
  if (!value) return "";
  if (typeof value === "number") {
    const hours = Math.floor(value * 24);
    const minutes = Math.floor((value * 24 - hours) * 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }
  return String(value);
};

export default function ImportData({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportDataProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewData, setPreviewData] = useState<ImportedEmployee[]>([]);

  const mapExcelData = useCallback(
    (workbook: XLSX.WorkBook): ImportedEmployee[] => {
      const getSheet = (name: string) =>
        workbook.Sheets[name]
          ? XLSX.utils.sheet_to_json(workbook.Sheets[name])
          : [];

      const sheets = {
        personal: getSheet("personal_data"),
        work: getSheet("personal_work_detail"),
        tax: getSheet("personal_tax"),
        money: getSheet("personal_money"),
        regAddr: getSheet("personal_registered_address"),
        currAddr: getSheet("personal_current_address"),
      };

      const createMap = (data: any[]) =>
        new Map(
          data.map((row: any) => [String(row["รหัสพนักงาน"] || "").trim(), row])
        );

      const maps = {
        work: createMap(sheets.work),
        tax: createMap(sheets.tax),
        money: createMap(sheets.money),
        regAddr: createMap(sheets.regAddr),
        currAddr: createMap(sheets.currAddr),
      };

      return (sheets.personal as any[])
        .map((row) => {
          const empId = String(row["รหัสพนักงาน"] || "").trim();
          if (!empId) return null;

          const w = maps.work.get(empId) || {};
          const t = maps.tax.get(empId) || {};
          const m = maps.money.get(empId) || {};
          const ra = maps.regAddr.get(empId) || {};
          const ca = maps.currAddr.get(empId) || {};

          return {
            employee_id: empId,
            title_name: row["คำนำหน้าชื่อ"] || "",
            name: row["ชื่อ-นามสกุล"] || "",
            nickname: row["ชื่อเล่น"] || "",
            gender: row["เพศ"] || "",
            birth_date: formatExcelDate(row["วันเกิด"]),
            mobile_phone: String(row["มือถือ"] || "").trim(),
            line_id: String(row["LineID"] || "").trim(),
            national_id: String(row["เลขประชาชน"] || "").trim(),
            national_idcard_issue_date: formatExcelDate(row["วันที่ออกบัตร"]),
            national_idcard_expiry_date: formatExcelDate(row["วันหมดอายุบัตร"]),
            national_idcard_issued_place: row["สถานที่ออกบัตร"] || "",
            nationality: row["สัญชาติ"] || "",
            race: row["เชื้อชาติ"] || "",
            religion: row["ศาสนา"] || "",
            height: parseFloat(row["ส่วนสูง"]) || 0,
            weight: parseFloat(row["น้ำหนัก"]) || 0,
            marital_status: row["สถานะภาพ"] || "",
            spouse_title_name: row["คำนำหน้าชื่อคู่สมรส"] || "",
            spouse_name: row["ชื่อ-นามสกุลคู่สมรส"] || "",
            number_of_children: parseInt(row["จำนวนบุตร"]) || 0,
            children_in_school: parseInt(row["จำนวนบุตรที่เรียนอยู่"]) || 0,
            children_notin_school:
              parseInt(row["จำนวนบุตรที่ศึกษาต่างประเทศหรือไม่ได้เรียน"]) || 0,
            emergency_contact_name: row["ชื่อ-สกุลผู้ติดต่อฉุกเฉิน"] || "",
            emergency_contact_relation:
              row["ความสัมพันธ์ผู้ติดต่อฉุกเฉิน"] || "",
            emergency_contact_phone: String(
              row["เบอร์โทรผู้ติดต่อฉุกเฉิน"] || ""
            ),
            position: w["ตำแหน่ง"] || "",
            division: w["ฝ่าย"] || "",
            department: w["แผนก"] || "",
            shift: w["กะ"] || "",
            employee_type: w["ประเภทพนักงาน"] || "",
            start_working_date: formatExcelDate(w["วันที่เริ่มงาน"]),
            end_working_date: formatExcelDate(w["วันที่ออกงาน"]),
            start_time: formatExcelTime(w["เวลาเริ่มทำงาน"]),
            start_lunch: formatExcelTime(w["เวลาเริ่มพัก"]),
            end_lunch: formatExcelTime(w["หมดเวลาพัก"]),
            end_time: formatExcelTime(w["เวลาออกงาน"]),
            working_status: w["สถานะการทำงาน"] || "",
            salary: parseFloat(w["เงินเดือน"]) || 0,
            daily_wage: parseFloat(w["เงินรายวัน"]) || 0,
            hourly_wage: parseFloat(w["เงินรายชั่วโมง"]) || 0,
            bank_id: t["รหัสธนาคาร"] || "",
            bank_account_number: String(t["เลขที่บัญชี"] || ""),
            tax_identification_number: String(
              t["เลขประจำตัวผู้เสียภาษี"] || ""
            ),
            social_security_number: String(t["เลขประกันสังคม"] || ""),
            provident_fund_number: String(t["เลขกองทุนสำรองเลี้ยงชีพ"] || ""),
            providentfund_entry_date: formatExcelDate(
              t["วันเข้ากองทุนสำรองเลี้ยงชีพ"]
            ),
            providentfund_issuance_date: formatExcelDate(
              t["วันออกกองทุนสำรองเลี้ยงชีพ"]
            ),
            studentloan_number: String(t["เลข_กยศ"] || ""),
            retirement_mutual_fund_number: String(t["เลข_ภงด_91"] || ""),
            rmf_number: String(t["เลข_rmf"] || ""),
            life_insurance_number: String(t["เลขประกันชีวิต"] || ""),
            social_security_contribution: parseFloat(m["หักประกันสังคม"]) || 0,
            company_provident_fund:
              parseFloat(m["กองทุนสำรองเลี้ยงชีพ(บริษัทสมทบ)"]) || 0,
            employee_provident_fund:
              parseFloat(m["กองทุนสำรองเลี้ยงชีพ(พนักงานสมทบ)"]) || 0,
            student_loan_deduction: parseFloat(m["หัก_กยศ"]) || 0,
            retirement_mutual_fund_deduction: parseFloat(m["หัก_ภงด_91"]) || 0,
            rmf_deduction: parseFloat(m["หัก_rmf"]) || 0,
            life_insurance_premium: parseFloat(m["หักเบี้ยประกันชีวิต"]) || 0,
            housing_loan_interest:
              parseFloat(m["หักดอกเบี้ยเงินกู้ที่อยู่อาศัย"]) || 0,
            registered_house_no: ra["บ้านเลขที่"] || "",
            registered_village: ra["หมู่ที่/หมู่บ้าน"] || "",
            registered_soi: ra["ซอย"] || "",
            registered_road: ra["ถนน"] || "",
            registered_subdistrict: ra["แขวง/ตำบล"] || "",
            registered_district: ra["เขต/อำเภอ"] || "",
            registered_province: ra["จังหวัด"] || "",
            registered_postcode: String(ra["รหัสไปรษณีย์"] || ""),
            current_house_no: ca["บ้านเลขที่"] || "",
            current_village: ca["หมู่ที่/หมู่บ้าน"] || "",
            current_soi: ca["ซอย"] || "",
            current_road: ca["ถนน"] || "",
            current_subdistrict: ca["แขวง/ตำบล"] || "",
            current_district: ca["เขต/อำเภอ"] || "",
            current_province: ca["จังหวัด"] || "",
            current_postcode: String(ca["รหัสไปรษณีย์"] || ""),
          };
        })
        .filter(
          (emp) => emp && emp.employee_id && emp.name
        ) as ImportedEmployee[];
    },
    []
  );

  const mapCSVData = useCallback((data: any[]): ImportedEmployee[] => {
    return data
      .map((row) => ({
        employee_id: String(row.employee_id || row["รหัสพนักงาน"] || "").trim(),
        name: String(row.name || row["ชื่อ-นามสกุล"] || "").trim(),
        title_name: row.title_name || row["คำนำหน้าชื่อ"] || "",
        gender: row.gender || row["เพศ"] || "",
        mobile_phone: String(row.mobile_phone || row["มือถือ"] || "").trim(),
        department: row.department || row["แผนก"] || "",
        division: row.division || row["ฝ่าย"] || "",
        position: row.position || row["ตำแหน่ง"] || "",
        employee_type: row.employee_type || row["ประเภทพนักงาน"] || "",
        salary: parseFloat(row.salary || row["เงินเดือน"] || 0) || 0,
        daily_wage: parseFloat(row.daily_wage || row["เงินรายวัน"] || 0) || 0,
        hourly_wage:
          parseFloat(row.hourly_wage || row["เงินรายชั่วโมง"] || 0) || 0,
        national_id: String(row.national_id || row["เลขประชาชน"] || ""),
      }))
      .filter((emp) => emp.employee_id && emp.name) as ImportedEmployee[];
  }, []);

  const parseFile = useCallback(
    (file: File) => {
      const ext = file.name.split(".").pop()?.toLowerCase();

      if (ext === "csv") {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) =>
            setPreviewData(mapCSVData(results.data as any[])),
          error: (err) =>
            setError(`เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: ${err.message}`),
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target?.result, { type: "binary" });
            setPreviewData(mapExcelData(workbook));
          } catch {
            setError("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel");
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    [mapCSVData, mapExcelData]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["xlsx", "xls", "csv"].includes(ext || "")) {
        setError("กรุณาเลือกไฟล์ Excel (.xlsx, .xls) หรือ CSV (.csv) เท่านั้น");
        return;
      }

      setSelectedFile(file);
      setError("");
      setSuccess("");
      parseFile(file);
    },
    [parseFile]
  );

  const processImport = useCallback(
    async (data: ImportedEmployee[]) => {
      if (data.length === 0) {
        setError("ไม่พบข้อมูลที่ถูกต้องในไฟล์");
        setImporting(false);
        return;
      }

      try {
        const response = await fetch("/api/employees/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employees: data }),
        });

        const result = await response.json();

        if (result.success) {
          let msg = `นำเข้าข้อมูลสำเร็จ ${result.inserted} รายการ`;
          if (result.skipped?.length > 0) {
            msg += `\n\nข้ามข้อมูลที่มีอยู่แล้ว ${result.skipped.length} รายการ:`;
            result.skipped.forEach((item: any) => {
              msg += `\n- รหัส: ${item.employee_id} | ชื่อ: ${item.name}`;
            });
          }
          setSuccess(msg);
          setTimeout(() => {
            onImportSuccess();
            handleClose();
          }, 3000);
        } else {
          setError(
            `เกิดข้อผิดพลาด: ${result.error || "ไม่สามารถนำเข้าข้อมูลได้"}`
          );
        }
      } catch {
        setError("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      } finally {
        setImporting(false);
      }
    },
    [onImportSuccess]
  );

  const handleImport = useCallback(async () => {
    if (!selectedFile) {
      setError("กรุณาเลือกไฟล์");
      return;
    }

    setImporting(true);
    setError("");
    setSuccess("");

    const ext = selectedFile.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          await processImport(mapCSVData(results.data as any[]));
        },
        error: () => {
          setError("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
          setImporting(false);
        },
      });
    } else {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: "binary" });
          await processImport(mapExcelData(workbook));
        } catch {
          setError("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel");
          setImporting(false);
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  }, [selectedFile, mapCSVData, mapExcelData, processImport]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setError("");
    setSuccess("");
    setPreviewData([]);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                นำเข้าข้อมูลพนักงาน
              </h2>
              <p className="text-sm text-gray-600">
                รองรับไฟล์ Excel (.xlsx, .xls) และ CSV (.csv)
              </p>
            </div>
          </div>

          <button
            onClick={downloadTemplate}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mr-4"
          >
            <Download size={20} />
            ดาวน์โหลด Template
          </button>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              เลือกไฟล์
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileSpreadsheet
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  {selectedFile ? selectedFile.name : "คลิกเพื่อเลือกไฟล์"}
                </p>
                <p className="text-sm text-gray-500">หรือลากไฟล์มาวางที่นี่</p>
                <p className="text-xs text-gray-400 mt-2">
                  รองรับ: .xlsx, .xls, .csv
                </p>
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              รูปแบบไฟล์ Excel ที่รองรับ
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>Sheet ที่ต้องมี:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                {Object.keys(TEMPLATE_CONFIG).map((sheet) => (
                  <li key={sheet}>• {sheet}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                ข้อมูลที่จะนำเข้า (ทั้งหมด {previewData.length} รายการ)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        รหัสพนักงาน
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        แผนก
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        ตำแหน่ง
                      </th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">
                        เงินเดือน
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">
                        วันเกิด
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((emp, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2">{emp.employee_id}</td>
                        <td className="px-4 py-2">{emp.name}</td>
                        <td className="px-4 py-2">{emp.department || "-"}</td>
                        <td className="px-4 py-2">{emp.position || "-"}</td>
                        <td className="px-4 py-2 text-right">
                          {emp.salary || "-"}
                        </td>
                        <td className="px-4 py-2">{emp.birth_date || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-green-800 whitespace-pre-line">{success}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleImport}
              disabled={!selectedFile || importing}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  กำลังนำเข้า...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  นำเข้าข้อมูล
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
