"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  User,
  Home,
  Briefcase,
  Calendar,
  CreditCard,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import {
  getProvinces,
  getDistricts,
  getSubdistricts,
  getZipcode,
} from "@/lib/thailand-address";

const FORM_SECTIONS = [
  {
    id: "personal",
    title: "ข้อมูลส่วนตัว",
    icon: User,
    color: "blue",
    fields: [
      {
        name: "employee_id",
        label: "รหัสพนักงาน",
        type: "text",
        required: true,
      },
      {
        name: "title_name",
        label: "คำนำหน้าชื่อ",
        type: "select",
        required: true,
        options: ["", "นาย", "นาง", "นางสาว"],
      },
      { name: "name", label: "ชื่อ-นามสกุล", type: "text", required: true },
      { name: "nickname", label: "ชื่อเล่น", type: "text" },
      {
        name: "gender",
        label: "เพศ",
        type: "select",
        required: true,
        options: ["", "ชาย", "หญิง", "อื่นๆ"],
      },
      { name: "birth_date", label: "วันเกิด", type: "date", required: true },
      { name: "nationality", label: "สัญชาติ", type: "text", required: true },
      { name: "race", label: "เชื้อชาติ", type: "text", required: true },
      { name: "religion", label: "ศาสนา", type: "text" },
      { name: "height", label: "ส่วนสูง (ซม.)", type: "number" },
      { name: "weight", label: "น้ำหนัก (กก.)", type: "number" },
      { name: "mobile_phone", label: "มือถือ", type: "text", required: true },
      {
        name: "marital_status",
        label: "สถานภาพ",
        type: "select",
        required: true,
        options: ["", "โสด", "สมรส", "หย่า"],
      },
      {
        name: "spouse_title_name",
        label: "คำนำหน้าชื่อ คู่สมรส",
        type: "select",
        options: ["", "นาย", "นาง", "นางสาว"],
      },
      { name: "spouse_name", label: "ชื่อ-นามสกุล คู่สมรส", type: "text" },
      {
        name: "number_of_children",
        label: "จำนวนบุตร",
        type: "number",
        step: "1",
      },
    ],
  },
  {
    id: "idcard",
    title: "ข้อมูลบัตรประชาชน",
    icon: CreditCard,
    color: "green",
    fields: [
      {
        name: "national_id",
        label: "เลขบัตรประชาชน",
        type: "text",
        required: true,
        maxLength: 13,
      },
      {
        name: "national_idcard_issue_date",
        label: "วันที่ออกบัตร",
        type: "date",
        required: true,
      },
      {
        name: "national_idcard_expiry_date",
        label: "วันที่หมดอายุ",
        type: "date",
        required: true,
      },
      {
        name: "national_idcard_issued_place",
        label: "สถานที่ออกบัตร",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "work",
    title: "ข้อมูลการทำงาน",
    icon: Briefcase,
    color: "purple",
    fields: [
      { name: "position", label: "ตำแหน่ง", type: "text", required: true },
      { name: "division", label: "ฝ่าย", type: "text", required: true },
      { name: "department", label: "แผนก", type: "text", required: true },
      {
        name: "start_working_date",
        label: "วันที่เริ่มงาน",
        type: "date",
        required: true,
      },
      { name: "end_working_date", label: "วันที่ออก", type: "date" },
      {
        name: "employee_type",
        label: "ประเภทพนักงาน",
        type: "select",
        required: true,
        options: [
          "",
          "พนักงานประจำ",
          "พนักงานรายวัน",
          "พนักงานสัญญาจ้าง",
          "พนักงานพาร์ทไทม์",
          "ช่วงทดลองงาน",
          "ฟรีแลนซ์",
          "นักศึกษาฝึกงาน",
        ],
      },
      { name: "shift", label: "กะการทำงาน", type: "text" },
    ],
  },
  {
    id: "bank",
    title: "ข้อมูลธนาคารและเลขประจำตัว",
    icon: Calendar,
    color: "indigo",
    fields: [
      { name: "bank_id", label: "รหัสธนาคาร", type: "text", required: true },
      {
        name: "bank_account_number",
        label: "เลขบัญชีธนาคาร",
        type: "text",
        required: true,
      },
      {
        name: "tax_identification_number",
        label: "เลขประจำตัวผู้เสียภาษี",
        type: "text",
      },
      { name: "social_security_number", label: "เลขประกันสังคม", type: "text" },
      {
        name: "provident_fund_number",
        label: "เลขกองทุนสำรองเลี้ยงชีพ",
        type: "text",
      },
      { name: "studentloan_number", label: "เลข กยศ.", type: "text" },
      {
        name: "retirement_mutual_fund_number",
        label: "เลข ภ.ง.ด.91",
        type: "text",
      },
      { name: "rmf_number", label: "เลข rmf", type: "text" },
      { name: "life_insurance_number", label: "เลขประกันชีวิต", type: "text" },
    ],
  },
  {
    id: "salary",
    title: "ข้อมูลเงินเดือนและสวัสดิการ",
    icon: DollarSign,
    color: "pink",
    fields: [
      { name: "salary", label: "เงินเดือน (บาท)", type: "number" },
      { name: "daily_wage", label: "ค่าแรงรายวัน (บาท)", type: "number" },
      { name: "hourly_wage", label: "ค่าแรงรายชั่วโมง (บาท)", type: "number" },
      {
        name: "social_security_contribution",
        label: "เงินสมทบประกันสังคม",
        type: "number",
      },
      {
        name: "company_provident_fund",
        label: "กองทุนสำรองเลี้ยงชีพ (บริษัท)",
        type: "number",
      },
      {
        name: "employee_provident_fund",
        label: "กองทุนสำรองเลี้ยงชีพ (พนักงาน)",
        type: "number",
      },
      { name: "student_loan_deduction", label: "หัก กยศ.", type: "number" },
      {
        name: "retirement_mutual_fund_deduction",
        label: "หัก ภ.ง.ด.91",
        type: "number",
      },
      { name: "rmf_deduction", label: "หักเบี้ย RMF", type: "number" },
      {
        name: "life_insurance_premium",
        label: "เบี้ยประกันชีวิต",
        type: "number",
      },
      {
        name: "housing_loan_interest",
        label: "ดอกเบี้ยเงินกู้ที่อยู่อาศัย",
        type: "number",
      },
    ],
  },
];

const TIME_FIELDS = [
  { name: "start_time", label: "เวลาเริ่มงาน" },
  { name: "start_lunch", label: "เวลาพักเที่ยง (เริ่ม)" },
  { name: "end_lunch", label: "เวลาพักเที่ยง (สิ้นสุด)" },
  { name: "end_time", label: "เวลาเลิกงาน" },
];

const ADDRESS_FIELDS = [
  { name: "house_no", label: "เลขที่", required: true },
  { name: "village", label: "หมู่ที่/หมู่บ้าน" },
  { name: "soi", label: "ซอย" },
  { name: "road", label: "ถนน" },
];

export default function Page() {
  const router = useRouter();
  const isCopyingAddress = useRef(false);
  const [formData, setFormData] = useState<any>({});
  const [regDistricts, setRegDistricts] = useState<string[]>([]);
  const [regSubdistricts, setRegSubdistricts] = useState<string[]>([]);
  const [currDistricts, setCurrDistricts] = useState<string[]>([]);
  const [currSubdistricts, setCurrSubdistricts] = useState<string[]>([]);

  const provinces = useMemo(() => getProvinces(), []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Address cascade effects
  useEffect(() => {
    if (formData.registered_province) {
      setRegDistricts(getDistricts(formData.registered_province));
      setFormData((p: any) => ({
        ...p,
        registered_district: "",
        registered_subdistrict: "",
        registered_postcode: "",
      }));
    } else setRegDistricts([]);
  }, [formData.registered_province]);

  useEffect(() => {
    if (formData.registered_province && formData.registered_district) {
      setRegSubdistricts(
        getSubdistricts(
          formData.registered_province,
          formData.registered_district
        )
      );
      setFormData((p: any) => ({
        ...p,
        registered_subdistrict: "",
        registered_postcode: "",
      }));
    } else setRegSubdistricts([]);
  }, [formData.registered_district]);

  useEffect(() => {
    if (
      formData.registered_province &&
      formData.registered_district &&
      formData.registered_subdistrict
    ) {
      const zip = getZipcode(
        formData.registered_province,
        formData.registered_district,
        formData.registered_subdistrict
      );
      setFormData((p: any) => ({ ...p, registered_postcode: zip }));
    }
  }, [formData.registered_subdistrict]);

  useEffect(() => {
    if (formData.current_province) {
      setCurrDistricts(getDistricts(formData.current_province));
      if (!isCopyingAddress.current) {
        setFormData((p: any) => ({
          ...p,
          current_district: "",
          current_subdistrict: "",
          current_postcode: "",
        }));
      }
    } else setCurrDistricts([]);
  }, [formData.current_province]);

  useEffect(() => {
    if (formData.current_province && formData.current_district) {
      setCurrSubdistricts(
        getSubdistricts(formData.current_province, formData.current_district)
      );
      if (!isCopyingAddress.current) {
        setFormData((p: any) => ({
          ...p,
          current_subdistrict: "",
          current_postcode: "",
        }));
      }
    } else setCurrSubdistricts([]);
  }, [formData.current_district]);

  useEffect(() => {
    if (
      formData.current_province &&
      formData.current_district &&
      formData.current_subdistrict
    ) {
      const zip = getZipcode(
        formData.current_province,
        formData.current_district,
        formData.current_subdistrict
      );
      setFormData((p: any) => ({ ...p, current_postcode: zip }));
    }
  }, [formData.current_subdistrict]);

  const copyRegisteredToCurrent = () => {
    isCopyingAddress.current = true;
    if (formData.registered_province) {
      setCurrDistricts(getDistricts(formData.registered_province));
      if (formData.registered_district) {
        setCurrSubdistricts(
          getSubdistricts(
            formData.registered_province,
            formData.registered_district
          )
        );
      }
    }
    setFormData((p: any) => ({
      ...p,
      current_house_no: p.registered_house_no,
      current_village: p.registered_village,
      current_soi: p.registered_soi,
      current_road: p.registered_road,
      current_province: p.registered_province,
      current_district: p.registered_district,
      current_subdistrict: p.registered_subdistrict,
      current_postcode: p.registered_postcode,
    }));
    setTimeout(() => {
      isCopyingAddress.current = false;
    }, 100);
  };

  const handleSubmit = async () => {
    if (!formData.employee_id || !formData.name || !formData.national_id) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน)");
      return;
    }

    const numFields = [
      "height",
      "weight",
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
    ];

    const cleanedData: any = { ...formData };
    numFields.forEach(
      (f) => (cleanedData[f] = formData[f] ? parseFloat(formData[f]) : null)
    );
    cleanedData.end_working_date = formData.end_working_date || null;

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });
      const result = await res.json();
      if (result.success) {
        alert("บันทึกข้อมูลพนักงานสำเร็จ!");
        router.push("/");
      } else alert("เกิดข้อผิดพลาด: " + result.error);
    } catch (error) {
      console.error("Network error:", error);
      alert("ไม่สามารถเชื่อมต่อกับ server ได้");
    }
  };

  const renderField = (field: any) => {
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        >
          {(field.options || []).map((opt: string) => (
            <option key={opt} value={opt}>
              {opt || `เลือก${field.label}`}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        step={field.step || (field.type === "number" ? "0.01" : undefined)}
        maxLength={field.maxLength}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
      />
    );
  };

  const renderAddress = (
    prefix: string,
    title: string,
    districts: string[],
    subdistricts: string[]
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="md:col-span-2 lg:col-span-3">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
      </div>

      {ADDRESS_FIELDS.map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {f.label} {f.required && "*"}
          </label>
          <input
            type="text"
            name={`${prefix}_${f.name}`}
            value={formData[`${prefix}_${f.name}`] || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          จังหวัด *
        </label>
        <select
          name={`${prefix}_province`}
          value={formData[`${prefix}_province`] || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          เขต/อำเภอ *
        </label>
        <select
          name={`${prefix}_district`}
          value={formData[`${prefix}_district`] || ""}
          onChange={handleChange}
          disabled={!formData[`${prefix}_province`]}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
        >
          <option value="">เลือกเขต/อำเภอ</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          แขวง/ตำบล *
        </label>
        <select
          name={`${prefix}_subdistrict`}
          value={formData[`${prefix}_subdistrict`] || ""}
          onChange={handleChange}
          disabled={!formData[`${prefix}_district`]}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
        >
          <option value="">เลือกแขวง/ตำบล</option>
          {subdistricts.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          รหัสไปรษณีย์ *
        </label>
        <input
          type="text"
          name={`${prefix}_postcode`}
          value={formData[`${prefix}_postcode`] || ""}
          readOnly
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <button
            onClick={() => router.push("/")}
            className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            กลับหน้าหลัก
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            แบบฟอร์มเพิ่มพนักงานใหม่
          </h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลพนักงาน</p>
        </div>

        <div className="space-y-6">
          {/* Regular Sections */}
          {FORM_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`bg-${section.color}-100 p-3 rounded-lg`}>
                  <section.icon
                    className={`text-${section.color}-600`}
                    size={24}
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {section.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.required && "*"}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Address Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลที่อยู่
              </h2>
            </div>
            {renderAddress(
              "registered",
              "ที่อยู่ตามบัตรประชาชน",
              regDistricts,
              regSubdistricts
            )}

            <div className="flex justify-start my-6">
              <button
                onClick={copyRegisteredToCurrent}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                คัดลอกที่อยู่ไปยังที่อยู่ปัจจุบัน
              </button>
            </div>

            <div className="mt-10">
              {renderAddress(
                "current",
                "ที่อยู่ปัจจุบัน",
                currDistricts,
                currSubdistricts
              )}
            </div>
          </div>

          {/* Time Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="text-orange-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">เวลาทำงาน</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TIME_FIELDS.map((f) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {f.label}
                  </label>
                  <TimePicker
                    onChange={(val) =>
                      setFormData((p: any) => ({ ...p, [f.name]: val || "" }))
                    }
                    value={formData[f.name]}
                    disableClock
                    format="HH:mm"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
