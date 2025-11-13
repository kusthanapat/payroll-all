"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
import {
  User,
  Home,
  Briefcase,
  Calendar,
  CreditCard,
  Clock,
  DollarSign,
  ArrowLeft,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
      { name: "number_of_children", label: "จำนวนบุตร", type: "number" },
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
      { name: "end_working_date", label: "วันที่ออกงาน", type: "date" },
      { name: "shift", label: "กะการทำงาน", type: "text" },
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

function EmployeeUpdateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const [regDistricts, setRegDistricts] = useState<string[]>([]);
  const [regSubdistricts, setRegSubdistricts] = useState<string[]>([]);
  const [currDistricts, setCurrDistricts] = useState<string[]>([]);
  const [currSubdistricts, setCurrSubdistricts] = useState<string[]>([]);

  const provinces = useMemo(() => getProvinces(), []);

  const fetchEmployeeById = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/employees?id=${id}`);
      const result = await res.json();
      if (result.success && result.data) loadEmployeeData(result.data);
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  }, []);

  useEffect(() => {
    if (idFromUrl) fetchEmployeeById(idFromUrl);
  }, [idFromUrl, fetchEmployeeById]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("กรุณากรอกคำค้นหา");
      return;
    }
    try {
      const res = await fetch(
        `/api/employees?search=${encodeURIComponent(searchQuery)}`
      );
      const result = await res.json();
      if (result.success) {
        setEmployees(result.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
      alert("ไม่สามารถค้นหาข้อมูลได้");
    }
  };

  const loadEmployeeData = (emp: any) => {
    const data: any = { id: emp.id || "" };
    FORM_SECTIONS.forEach((section) => {
      section.fields.forEach((field) => {
        const val = emp[field.name];
        data[field.name] =
          field.type === "number" && val ? val.toString() : val || "";
      });
    });

    TIME_FIELDS.forEach((f) => (data[f.name] = emp[f.name] || ""));
    ["registered", "current"].forEach((prefix) => {
      ADDRESS_FIELDS.forEach(
        (f) => (data[`${prefix}_${f.name}`] = emp[`${prefix}_${f.name}`] || "")
      );
      ["province", "district", "subdistrict", "postcode"].forEach(
        (f) => (data[`${prefix}_${f}`] = emp[`${prefix}_${f}`] || "")
      );
    });

    setFormData(data);
    setSelectedEmployeeId(emp.id);
    setShowResults(false);
  };

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
    if (formData.current_province)
      setCurrDistricts(getDistricts(formData.current_province));
  }, [formData.current_province]);

  useEffect(() => {
    if (formData.current_province && formData.current_district) {
      setCurrSubdistricts(
        getSubdistricts(formData.current_province, formData.current_district)
      );
    }
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

  const handleSubmit = async () => {
    if (!formData.id) {
      alert("กรุณาเลือกพนักงานที่ต้องการอัปเดต");
      return;
    }
    if (!formData.employee_id || !formData.name || !formData.national_id) {
      alert("กรุณากรอกข้อมูลที่จำเป็น (รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน)");
      return;
    }

    const cleanedData: any = { id: formData.id };
    Object.keys(formData).forEach((key) => {
      const val = formData[key];
      if (
        [
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
        ].includes(key)
      ) {
        cleanedData[key] = val ? parseFloat(val) : null;
      } else {
        cleanedData[key] = val;
      }
    });

    try {
      const res = await fetch("/api/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });
      const result = await res.json();
      if (result.success) {
        alert("อัปเดตข้อมูลพนักงานสำเร็จ!");
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
        step={field.type === "number" ? "0.01" : undefined}
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
    <>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
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
            แบบฟอร์มอัปเดตข้อมูลพนักงาน
          </h1>
          <p className="text-gray-600">ค้นหาและอัปเดตข้อมูลพนักงาน</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหารายชื่อพนักงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Search size={20} />
              ค้นหา
            </button>
          </div>

          {showResults && (
            <div className="mt-4">
              {employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg font-semibold">ไม่พบข้อมูลพนักงาน</p>
                  <p className="text-sm">กรุณาลองค้นหาด้วยชื่ออื่น</p>
                </div>
              ) : (
                <div className="border-t-2 border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    ผลการค้นหา ({employees.length} รายการ)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {employees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => loadEmployeeData(emp)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedEmployeeId === emp.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <User className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {emp.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {emp.employee_id} - {emp.position}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Regular Form Sections */}
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
            <div className="mt-8">
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
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              อัปเดตข้อมูล
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      }
    >
      <EmployeeUpdateForm />
    </Suspense>
  );
}
