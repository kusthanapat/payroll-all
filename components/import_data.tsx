"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

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
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_phone?: string;
  position?: string;
  division?: string;
  department?: string;
  employee_type?: string;
  start_working_date?: string;
  end_working_date?: string;
  start_time?: string;
  start_lunch?: string;
  end_lunch?: string;
  end_time?: string;
  salary?: number;
  daily_wage?: number;
  hourly_wage?: number;
  bank_id?: string;
  bank_account_number?: string;
  tax_identification_number?: string;
  social_security_number?: string;
  provident_fund_number?: string;
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

export default function ImportData({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportDataProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [previewData, setPreviewData] = useState<ImportedEmployee[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension || "")) {
      setError("กรุณาเลือกไฟล์ Excel (.xlsx, .xls) หรือ CSV (.csv) เท่านั้น");
      return;
    }

    setSelectedFile(file);
    setError("");
    setSuccess("");
    parseFile(file);
  };

  const parseFile = async (file: File) => {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    try {
      if (fileExtension === "csv") {
        // Parse CSV (simple single sheet)
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const data = results.data as any[];
            const mappedData = mapCSVData(data);
            setPreviewData(mappedData);
          },
          error: (error) => {
            setError("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV: " + error.message);
          },
        });
      } else {
        // Parse Excel with multiple sheets
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const mappedData = mapExcelData(workbook);
            setPreviewData(mappedData);
          } catch (err) {
            setError("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel");
          }
        };
        reader.readAsBinaryString(file);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการอ่านไฟล์");
    }
  };

  const mapExcelData = (workbook: XLSX.WorkBook): ImportedEmployee[] => {
    // อ่านข้อมูลจากแต่ละ sheet
    const personalData = workbook.Sheets["personal_data"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_data"])
      : [];
    const workDetail = workbook.Sheets["personal_work_detail"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_work_detail"])
      : [];
    const taxData = workbook.Sheets["personal_tax"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_tax"])
      : [];
    const moneyData = workbook.Sheets["personal_money"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_money"])
      : [];
    const registeredAddress = workbook.Sheets["personal_registered_address"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_registered_address"])
      : [];
    const currentAddress = workbook.Sheets["personal_current_address"]
      ? XLSX.utils.sheet_to_json(workbook.Sheets["personal_current_address"])
      : [];

    // สร้าง Map สำหรับค้นหาข้อมูลจาก employee_id
    const workDetailMap = new Map(
      workDetail.map((row: any) => [
        String(row["รหัสพนักงาน"] || "").trim(),
        row,
      ])
    );
    const taxDataMap = new Map(
      taxData.map((row: any) => [String(row["รหัสพนักงาน"] || "").trim(), row])
    );
    const moneyDataMap = new Map(
      moneyData.map((row: any) => [
        String(row["รหัสพนักงาน"] || "").trim(),
        row,
      ])
    );
    const registeredAddressMap = new Map(
      registeredAddress.map((row: any) => [
        String(row["รหัสพนักงาน"] || "").trim(),
        row,
      ])
    );
    const currentAddressMap = new Map(
      currentAddress.map((row: any) => [
        String(row["รหัสพนักงาน"] || "").trim(),
        row,
      ])
    );

    // รวมข้อมูลทั้งหมดโดยใช้ personal_data เป็นหลัก
    const mappedData: ImportedEmployee[] = (personalData as any[])
      .map((row) => {
        const employeeId = String(row["รหัสพนักงาน"] || "").trim();
        if (!employeeId) return null;

        const work = workDetailMap.get(employeeId) || {};
        const tax = taxDataMap.get(employeeId) || {};
        const money = moneyDataMap.get(employeeId) || {};
        const regAddr = registeredAddressMap.get(employeeId) || {};
        const currAddr = currentAddressMap.get(employeeId) || {};

        return {
          employee_id: employeeId,
          title_name: row["คำนำหน้าชื่อ"] || "",
          name: row["ชื่อ-นามสกุล"] || "",
          nickname: row["ชื่อเล่น"] || "",
          gender: row["เพศ"] || "",
          birth_date: formatExcelDate(row["วันเกิด"]) || "",
          mobile_phone: String(row["มือถือ"] || "").trim(),
          national_id: String(row["เลขประชาชน"] || "").trim(),
          national_idcard_issue_date:
            formatExcelDate(row["วันที่ออกบัตร"]) || "",
          national_idcard_expiry_date:
            formatExcelDate(row["วันหมดอายุบัตร"]) || "",
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
          emergency_contact_name: row["ชื่อ-สกุลผู้ติดต่อฉุกเฉิน"] || "",
          emergency_contact_relation: row["ความสัมพันธ์ผู้ติดต่อฉุกเฉิน"] || "",
          emergency_contact_phone: String(
            row["เบอร์โทรผู้ติดต่อฉุกเฉิน"] || ""
          ),
          // From personal_work_detail
          position: work["ตำแหน่ง"] || "",
          division: work["ฝ่าย"] || "",
          department: work["แผนก"] || "",
          employee_type: work["ประเภทพนักงาน"] || "",
          start_working_date: formatExcelDate(work["วันที่เริ่มงาน"]) || "",
          end_working_date: formatExcelDate(work["วันที่ออกงาน"]) || "",
          start_time: formatExcelTime(work["เวลาเริ่มทำงาน"]) || "",
          start_lunch: formatExcelTime(work["เวลาเริ่มพัก"]) || "",
          end_lunch: formatExcelTime(work["หมดเวลาพัก"]) || "",
          end_time: formatExcelTime(work["เวลาออกงาน"]) || "",
          salary: parseFloat(work["เงินเดือน"]) || 0,
          daily_wage: parseFloat(work["เงินรายวัน"]) || 0,
          hourly_wage: parseFloat(work["เงินรายชั่วโมง"]) || 0,
          // From personal_tax
          bank_id: tax["รหัสธนาคาร"] || "",
          bank_account_number: String(tax["เลขที่บัญชี"] || ""),
          tax_identification_number: String(
            tax["เลขประจำตัวผู้เสียภาษี"] || ""
          ),
          social_security_number: String(tax["เลขประกันสังคม"] || ""),
          provident_fund_number: String(tax["เลขกองทุนสำรองเลี้ยงชีพ"] || ""),
          studentloan_number: String(tax["เลข_กยศ"] || ""),
          retirement_mutual_fund_number: String(tax["เลข_ภงด_91"] || ""),
          rmf_number: String(tax["เลข_rmf"] || ""),
          life_insurance_number: String(tax["เลขประกันชีวิต"] || ""),
          // From personal_money
          social_security_contribution:
            parseFloat(money["หักประกันสังคม"]) || 0,
          company_provident_fund:
            parseFloat(money["กองทุนสำรองเลี้ยงชีพ(บริษัทสมทบ)"]) || 0,
          employee_provident_fund:
            parseFloat(money["กองทุนสำรองเลี้ยงชีพ(พนักงานสมทบ)"]) || 0,
          student_loan_deduction: parseFloat(money["หัก_กยศ"]) || 0,
          retirement_mutual_fund_deduction:
            parseFloat(money["หัก_ภงด_91"]) || 0,
          rmf_deduction: parseFloat(money["หัก_rmf"]) || 0,
          life_insurance_premium: parseFloat(money["หักเบี้ยประกันชีวิต"]) || 0,
          housing_loan_interest:
            parseFloat(money["หักดอกเบี้ยเงินกู้ที่อยู่อาศัย"]) || 0,
          // From personal_registered_address
          registered_house_no: regAddr["บ้านเลขที่"] || "",
          registered_village: regAddr["หมู่ที่/หมู่บ้าน"] || "",
          registered_soi: regAddr["ซอย"] || "",
          registered_road: regAddr["ถนน"] || "",
          registered_subdistrict: regAddr["แขวง/ตำบล"] || "",
          registered_district: regAddr["เขต/อำเภอ"] || "",
          registered_province: regAddr["จังหวัด"] || "",
          registered_postcode: String(regAddr["รหัสไปรษณีย์"] || ""),
          // From personal_current_address
          current_house_no: currAddr["บ้านเลขที่"] || "",
          current_village: currAddr["หมู่ที่/หมู่บ้าน"] || "",
          current_soi: currAddr["ซอย"] || "",
          current_road: currAddr["ถนน"] || "",
          current_subdistrict: currAddr["แขวง/ตำบล"] || "",
          current_district: currAddr["เขต/อำเภอ"] || "",
          current_province: currAddr["จังหวัด"] || "",
          current_postcode: String(currAddr["รหัสไปรษณีย์"] || ""),
        };
      })
      .filter(
        (emp) => emp !== null && emp.employee_id && emp.name
      ) as ImportedEmployee[];

    return mappedData;
  };

  const mapCSVData = (data: any[]): ImportedEmployee[] => {
    // สำหรับ CSV ที่มีข้อมูลแบบง่าย (ไม่มีหลาย sheet)
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
  };

  const formatExcelDate = (value: any): string => {
    if (!value) return "";

    // ถ้าเป็น Excel serial date
    if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value);
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
        date.d
      ).padStart(2, "0")}`;
    }

    // ถ้าเป็นข้อความวันที่แล้ว
    if (typeof value === "string") {
      // ลองแปลงรูปแบบต่างๆ
      const dateFormats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
      ];

      for (const format of dateFormats) {
        const match = value.match(format);
        if (match) {
          if (format === dateFormats[0]) {
            // DD/MM/YYYY -> YYYY-MM-DD
            return `${match[3]}-${match[2].padStart(
              2,
              "0"
            )}-${match[1].padStart(2, "0")}`;
          } else {
            // YYYY-MM-DD (already correct format)
            return `${match[1]}-${match[2].padStart(
              2,
              "0"
            )}-${match[3].padStart(2, "0")}`;
          }
        }
      }
    }

    return String(value);
  };

  const formatExcelTime = (value: any): string => {
    if (!value) return "";

    // ถ้าเป็นเลขทศนิยม (Excel time format)
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

  const handleImport = async () => {
    if (!selectedFile) {
      setError("กรุณาเลือกไฟล์");
      return;
    }

    setImporting(true);
    setError("");
    setSuccess("");

    try {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      let allData: ImportedEmployee[] = [];

      if (fileExtension === "csv") {
        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            allData = mapCSVData(results.data as any[]);
            await processImport(allData);
          },
          error: (error) => {
            setError("เกิดข้อผิดพลาดในการอ่านไฟล์ CSV");
            setImporting(false);
          },
        });
      } else {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            allData = mapExcelData(workbook);
            await processImport(allData);
          } catch (err) {
            setError("เกิดข้อผิดพลาดในการอ่านไฟล์ Excel");
            setImporting(false);
          }
        };
        reader.readAsBinaryString(selectedFile);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      setImporting(false);
    }
  };

  const processImport = async (data: ImportedEmployee[]) => {
    try {
      if (data.length === 0) {
        setError("ไม่พบข้อมูลที่ถูกต้องในไฟล์");
        setImporting(false);
        return;
      }

      const response = await fetch("/api/employees/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employees: data }),
      });

      const result = await response.json();

      if (result.success) {
        let message = `นำเข้าข้อมูลสำเร็จ ${result.inserted} รายการ`;

        if (result.skipped && result.skipped.length > 0) {
          message += `\n\nข้ามข้อมูลที่มีอยู่แล้ว ${result.skipped.length} รายการ:`;
          result.skipped.forEach((item: any) => {
            message += `\n- รหัส: ${item.employee_id} | ชื่อ: ${item.name}`;
          });
        }

        setSuccess(message);
        setTimeout(() => {
          onImportSuccess();
          handleClose();
        }, 3000);
      } else {
        setError(
          "เกิดข้อผิดพลาด: " + (result.error || "ไม่สามารถนำเข้าข้อมูลได้")
        );
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");
    setPreviewData([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
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
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
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

          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              รูปแบบไฟล์ Excel, CSV ที่รองรับ
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>Sheet ที่ต้องมี:</strong>
              </p>
              <ul className="ml-4 space-y-1">
                <li>• personal_data</li>
                <li>• personal_work_detail</li>
                <li>• personal_tax</li>
                <li>• personal_money</li>
                <li>• personal_registered_address</li>
                <li>• personal_current_address</li>
                <li>• fifty_tawi</li>
              </ul>
            </div>
          </div>

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
                    {previewData.map((emp, index) => (
                      <tr
                        key={index}
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

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <p className="text-green-800 whitespace-pre-line">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
