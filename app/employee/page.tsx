"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Home,
  Briefcase,
  Calendar,
  CreditCard,
  Clock,
  DollarSign,
  ArrowLeft,
  MapPin,
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

export default function Page() {
  const router = useRouter();

  const isCopyingAddress = useRef(false);

  const [formData, setFormData] = useState({
    // ข้อมูลส่วนตัว
    employee_id: "",
    title_name: "",
    name: "",
    gender: "",
    nickname: "",
    birth_date: "",
    national_id: "",
    national_idcard_issue_date: "",
    national_idcard_expiry_date: "",
    national_idcard_issued_place: "",
    mobile_phone: "",
    nationality: "",
    race: "",
    religion: "",
    height: "",
    weight: "",
    employee_type: "",
    shift: "",
    start_time: "",
    start_lunch: "",
    end_lunch: "",
    end_time: "",
    start_working_date: "",
    end_working_date: "",
    salary: "",
    daily_wage: "",
    hourly_wage: "",

    // ที่อยู่ตามทะเบียนบ้าน
    registered_house_no: "",
    registered_village: "",
    registered_soi: "",
    registered_road: "",
    registered_province: "",
    registered_district: "",
    registered_subdistrict: "",
    registered_postcode: "",
    // ที่อยู่ปัจจุบัน
    current_house_no: "",
    current_village: "",
    current_soi: "",
    current_road: "",
    current_province: "",
    current_district: "",
    current_subdistrict: "",
    current_postcode: "",

    // ตำแหน่ง
    position: "",
    division: "",
    department: "",

    // ครอบครัว
    marital_status: "",
    spouse_title_name: "",
    spouse_name: "",
    number_of_children: "",

    // ธนาคาร
    bank_id: "",
    bank_account_number: "",

    // เลขภาษี
    tax_identification_number: "", // เลขประจำตัวผู้เสียภาษี
    social_security_number: "", // เลขประกันสังคม
    provident_fund_number: "", // เลขกองทุนสำรองเลี้ยงชีพ
    studentloan_number: "", // เลข กยศ.
    retirement_mutual_fund_number: "", // เลข ภ.ง.ด.
    rmf_number: "", // เลข rmf
    life_insurance_number: "", // เลขประกันชีวิต

    // หักค่าเบี้ย
    social_security_contribution: "", // หักประกันสังคม
    company_provident_fund: "", // บริษัทสมทบ กองทุนสำรองเลี้ยงชีพ
    employee_provident_fund: "", // พนักงานสมทบ กองทุนสำรองเลี้ยงชีพ
    student_loan_deduction: "", // หักค่า กยศ.
    retirement_mutual_fund_deduction: "", // หักค่า ภ.ง.ด.91.
    rmf_deduction: "", // หัก rmf
    life_insurance_premium: "", // หักประกันชีวิต
    housing_loan_interest: "", // หักเบี้ยที่อยู่อาศัย
  });

  // State สำหรับเก็บ options ของ dropdown
  const [registeredDistricts, setRegisteredDistricts] = useState<string[]>([]);
  const [registeredSubdistricts, setRegisteredSubdistricts] = useState<
    string[]
  >([]);
  const [currentDistricts, setCurrentDistricts] = useState<string[]>([]);
  const [currentSubdistricts, setCurrentSubdistricts] = useState<string[]>([]);

  const provinces = getProvinces();

  // Handle เมื่อเลือกจังหวัดทะเบียนบ้าน
  useEffect(() => {
    if (formData.registered_province) {
      const districts = getDistricts(formData.registered_province);
      setRegisteredDistricts(districts);
      setFormData((prev) => ({
        ...prev,
        registered_district: "",
        registered_subdistrict: "",
        registered_postcode: "",
      }));
    } else {
      setRegisteredDistricts([]);
    }
  }, [formData.registered_province]);

  // Handle เมื่อเลือกอำเภอทะเบียนบ้าน
  useEffect(() => {
    if (formData.registered_province && formData.registered_district) {
      const subdistricts = getSubdistricts(
        formData.registered_province,
        formData.registered_district
      );
      setRegisteredSubdistricts(subdistricts);
      setFormData((prev) => ({
        ...prev,
        registered_subdistrict: "",
        registered_postcode: "",
      }));
    } else {
      setRegisteredSubdistricts([]);
    }
  }, [formData.registered_district]);

  // Handle เมื่อเลือกตำบลทะเบียนบ้าน
  useEffect(() => {
    if (
      formData.registered_province &&
      formData.registered_district &&
      formData.registered_subdistrict
    ) {
      const zipcode = getZipcode(
        formData.registered_province,
        formData.registered_district,
        formData.registered_subdistrict
      );
      setFormData((prev) => ({
        ...prev,
        registered_postcode: zipcode,
      }));
    }
  }, [formData.registered_subdistrict]);

  // Handle เมื่อเลือกจังหวัดปัจจุบัน
  useEffect(() => {
    if (formData.current_province) {
      const districts = getDistricts(formData.current_province);
      setCurrentDistricts(districts);

      // เช็คว่ากำลังคัดลอกอยู่หรือไม่
      if (!isCopyingAddress.current) {
        setFormData((prev) => ({
          ...prev,
          current_district: "",
          current_subdistrict: "",
          current_postcode: "",
        }));
      }
    } else {
      setCurrentDistricts([]);
    }
  }, [formData.current_province]);

  // Handle เมื่อเลือกอำเภอปัจจุบัน
  useEffect(() => {
    if (formData.current_province && formData.current_district) {
      const subdistricts = getSubdistricts(
        formData.current_province,
        formData.current_district
      );
      setCurrentSubdistricts(subdistricts);

      // เช็คว่ากำลังคัดลอกอยู่หรือไม่
      if (!isCopyingAddress.current) {
        setFormData((prev) => ({
          ...prev,
          current_subdistrict: "",
          current_postcode: "",
        }));
      }
    } else {
      setCurrentSubdistricts([]);
    }
  }, [formData.current_district]);

  // Handle เมื่อเลือกตำบลปัจจุบัน
  useEffect(() => {
    if (
      formData.current_province &&
      formData.current_district &&
      formData.current_subdistrict
    ) {
      const zipcode = getZipcode(
        formData.current_province,
        formData.current_district,
        formData.current_subdistrict
      );
      setFormData((prev) => ({
        ...prev,
        current_postcode: zipcode,
      }));
    }
  }, [formData.current_subdistrict]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ฟังก์ชันคัดลอกที่อยู่ (แก้ไขแล้ว)
  const copyRegisteredToCurrent = () => {
    // ตั้ง flag เป็น true ก่อนคัดลอก
    isCopyingAddress.current = true;

    // Load districts และ subdistricts ของจังหวัดที่จะคัดลอก
    if (formData.registered_province) {
      const districts = getDistricts(formData.registered_province);
      setCurrentDistricts(districts);

      if (formData.registered_district) {
        const subdistricts = getSubdistricts(
          formData.registered_province,
          formData.registered_district
        );
        setCurrentSubdistricts(subdistricts);
      }
    }

    // คัดลอกข้อมูลทั้งหมด
    setFormData((prev) => ({
      ...prev,
      current_house_no: prev.registered_house_no,
      current_village: prev.registered_village,
      current_soi: prev.registered_soi,
      current_road: prev.registered_road,
      current_province: prev.registered_province,
      current_district: prev.registered_district,
      current_subdistrict: prev.registered_subdistrict,
      current_postcode: prev.registered_postcode,
    }));

    // รอให้ state update เสร็จแล้วค่อยปิด flag
    setTimeout(() => {
      isCopyingAddress.current = false;
    }, 100);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.employee_id || !formData.name || !formData.national_id) {
        alert("กรุณากรอกข้อมูลที่จำเป็น (รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน)");
        return;
      }

      const cleanedData = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        end_working_date: formData.end_working_date || null,
        daily_wage: formData.daily_wage
          ? parseFloat(formData.daily_wage)
          : null,
        hourly_wage: formData.hourly_wage
          ? parseFloat(formData.hourly_wage)
          : null,
        social_security_contribution: formData.social_security_contribution
          ? parseFloat(formData.social_security_contribution)
          : null,
        company_provident_fund: formData.company_provident_fund
          ? parseFloat(formData.company_provident_fund)
          : null,
        employee_provident_fund: formData.employee_provident_fund
          ? parseFloat(formData.employee_provident_fund)
          : null,
        student_loan_deduction: formData.student_loan_deduction
          ? parseFloat(formData.student_loan_deduction)
          : null,
        retirement_mutual_fund_deduction: formData.retirement_mutual_fund_deduction
          ? parseFloat(formData.retirement_mutual_fund_deduction)
          : null,
        rmf_deduction: formData.rmf_deduction
          ? parseFloat(formData.rmf_deduction)
          : null,
        life_insurance_premium: formData.life_insurance_premium
          ? parseFloat(formData.life_insurance_premium)
          : null,
        housing_loan_interest: formData.housing_loan_interest
          ? parseFloat(formData.housing_loan_interest)
          : null,
      };

      // log data
      console.log("Data to send:", cleanedData);

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.success) {
        alert("บันทึกข้อมูลพนักงานสำเร็จ!");
        router.push("/");
      } else {
        alert("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("ไม่สามารถเชื่อมต่อกับ server ได้");
    }
  };

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
          {/* ข้อมูลส่วนตัว */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลส่วนตัว
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รหัสพนักงาน *
                </label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำนำหน้าชื่อ *
                </label>
                <select
                  name="title_name"
                  value={formData.title_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกคำนำหน้าชื่อ</option>
                  <option value="นาย">นาย/MR</option>
                  <option value="นาง">นาง/MRS</option>
                  <option value="นางสาว">นางสาว/MS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อเล่น
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เพศ *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันเกิด *
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สัญชาติ *
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เชื้อชาติ *
                </label>
                <input
                  type="text"
                  name="race"
                  value={formData.race}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ศาสนา
                </label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ส่วนสูง (ซม.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  น้ำหนัก (กก.)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  มือถือ *
                </label>
                <input
                  type="text"
                  name="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สถานภาพ *
                </label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกสถานภาพ</option>
                  <option value="โสด">โสด</option>
                  <option value="สมรส">สมรส</option>
                  <option value="หย่า">หย่า</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  คำนำหน้าชื่อ คู่สมรส *
                </label>
                <select
                  name="spouse_title_name"
                  value={formData.spouse_title_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกคำนำหน้าชื่อ</option>
                  <option value="นาย">นาย/MR</option>
                  <option value="นาง">นาง/MRS</option>
                  <option value="นางสาว">นางสาว/MS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ-นามสกุล คู่สมรส *
                </label>
                <input
                  type="text"
                  name="spouse_name"
                  value={formData.spouse_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จำนวนบุตร
                </label>
                <input
                  type="number"
                  step="1"
                  name="number_of_children"
                  value={formData.number_of_children}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลที่อยู่ */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Home className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลที่อยู่
              </h2>
            </div>

            {/* ข้อมูลที่อยู่ตามทะเบียนบ้าน */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ที่อยู่ตามบัตรประชาชน เลขที่ *
                </label>
                <input
                  type="text"
                  name="registered_house_no"
                  value={formData.registered_house_no}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมู่ที่/หมู่บ้าน
                </label>
                <input
                  type="text"
                  name="registered_village"
                  value={formData.registered_village}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ซอย
                </label>
                <input
                  type="text"
                  name="registered_soi"
                  value={formData.registered_soi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ถนน
                </label>
                <input
                  type="text"
                  name="registered_road"
                  value={formData.registered_road}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จังหวัด *
                </label>
                <select
                  name="registered_province"
                  value={formData.registered_province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เขต/อำเภอ *
                </label>
                <select
                  name="registered_district"
                  value={formData.registered_district}
                  onChange={handleChange}
                  disabled={!formData.registered_province}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">เลือกเขต/อำเภอ</option>
                  {registeredDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  แขวง/ตำบล *
                </label>
                <select
                  name="registered_subdistrict"
                  value={formData.registered_subdistrict}
                  onChange={handleChange}
                  disabled={!formData.registered_district}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">เลือกแขวง/ตำบล</option>
                  {registeredSubdistricts.map((subdistrict) => (
                    <option key={subdistrict} value={subdistrict}>
                      {subdistrict}
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
                  name="registered_postcode"
                  value={formData.registered_postcode}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* ปุ่มคัดลอกที่อยู่ */}
            <div className="flex justify-start my-6">
              <button
                type="button"
                onClick={copyRegisteredToCurrent}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
              >
                คัดลอกที่อยู่ไปยังที่อยู่ปัจจุบัน
              </button>
            </div>

            {/* ข้อมูลที่อยู่ปัจจุบัน */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ที่อยู่ปัจจุบัน เลขที่ *
                </label>
                <input
                  type="text"
                  name="current_house_no"
                  value={formData.current_house_no}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หมู่ที่/หมู่บ้าน
                </label>
                <input
                  type="text"
                  name="current_village"
                  value={formData.current_village}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ซอย
                </label>
                <input
                  type="text"
                  name="current_soi"
                  value={formData.current_soi}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ถนน
                </label>
                <input
                  type="text"
                  name="current_road"
                  value={formData.current_road}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  จังหวัด *
                </label>
                <select
                  name="current_province"
                  value={formData.current_province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เขต/อำเภอ *
                </label>
                <select
                  name="current_district"
                  value={formData.current_district}
                  onChange={handleChange}
                  disabled={!formData.current_province}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">เลือกเขต/อำเภอ</option>
                  {currentDistricts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  แขวง/ตำบล *
                </label>
                <select
                  name="current_subdistrict"
                  value={formData.current_subdistrict}
                  onChange={handleChange}
                  disabled={!formData.current_district}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">เลือกแขวง/ตำบล</option>
                  {currentSubdistricts.map((subdistrict) => (
                    <option key={subdistrict} value={subdistrict}>
                      {subdistrict}
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
                  name="current_postcode"
                  value={formData.current_postcode}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลบัตรประชาชน */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-lg">
                <CreditCard className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลบัตรประชาชน
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขบัตรประชาชน *
                </label>
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  maxLength={13}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันที่ออกบัตร *
                </label>
                <input
                  type="date"
                  name="national_idcard_issue_date"
                  value={formData.national_idcard_issue_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันที่หมดอายุ *
                </label>
                <input
                  type="date"
                  name="national_idcard_expiry_date"
                  value={formData.national_idcard_expiry_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  สถานที่ออกบัตร *
                </label>
                <input
                  type="text"
                  name="national_idcard_issued_place"
                  value={formData.national_idcard_issued_place}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลการทำงาน */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลการทำงาน
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ตำแหน่ง *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ฝ่าย *
                </label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  แผนก *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันที่เริ่มงาน *
                </label>
                <input
                  type="date"
                  name="start_working_date"
                  value={formData.start_working_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  วันที่ออก
                </label>
                <input
                  type="date"
                  name="end_working_date"
                  value={formData.end_working_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ประเภทพนักงาน *
                </label>
                <select
                  name="employee_type"
                  value={formData.employee_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">เลือกประเภทพนักงาน</option>
                  <option value="พนักงานประจำ">พนักงานประจำ</option>
                  <option value="พนักงานรายวัน">พนักงานรายวัน</option>
                  <option value="พนักงานสัญญาจ้าง">พนักงานสัญญาจ้าง</option>
                  <option value="พนักงานพาร์ทไทม์">พนักงานพาร์ทไทม์</option>
                  <option value="ช่วงทดลองงาน">ช่วงทดลองงาน</option>
                  <option value="ฟรีแลนซ์">ฟรีแลนซ์</option>
                  <option value="นักศึกษาฝึกงาน">นักศึกษาฝึกงาน</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  กะการทำงาน
                </label>
                <input
                  type="text"
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* เวลาทำงาน */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="text-orange-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">เวลาทำงาน</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เวลาเริ่มงาน
                </label>
                <TimePicker
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      start_time: value || "",
                    }))
                  }
                  value={formData.start_time}
                  disableClock
                  format="HH:mm"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เวลาพักเที่ยง (เริ่ม)
                </label>
                <TimePicker
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      start_lunch: value || "",
                    }))
                  }
                  value={formData.start_lunch}
                  disableClock
                  format="HH:mm"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เวลาพักเที่ยง (สิ้นสุด)
                </label>
                <TimePicker
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, end_lunch: value || "" }))
                  }
                  value={formData.end_lunch}
                  disableClock
                  format="HH:mm"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เวลาเลิกงาน
                </label>
                <TimePicker
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, end_time: value || "" }))
                  }
                  value={formData.end_time}
                  disableClock
                  format="HH:mm"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลธนาคารและเลขประจำตัว */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Calendar className="text-indigo-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลธนาคารและเลขประจำตัว
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รหัสธนาคาร *
                </label>
                <input
                  type="text"
                  name="bank_id"
                  value={formData.bank_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขบัญชีธนาคาร *
                </label>
                <input
                  type="text"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขประจำตัวผู้เสียภาษี
                </label>
                <input
                  type="text"
                  name="tax_identification_number"
                  value={formData.tax_identification_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขประกันสังคม
                </label>
                <input
                  type="text"
                  name="social_security_number"
                  value={formData.social_security_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขกองทุนสำรองเลี้ยงชีพ
                </label>
                <input
                  type="text"
                  name="provident_fund_number"
                  value={formData.provident_fund_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลข กยศ.
                </label>
                <input
                  type="text"
                  name="studentloan_number"
                  value={formData.studentloan_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลข ภ.ง.ด.91
                </label>
                <input
                  type="text"
                  name="retirement_mutual_fund_number"
                  value={formData.retirement_mutual_fund_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลข rmf
                </label>
                <input
                  type="text"
                  name="rmf_number"
                  value={formData.rmf_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขประกันชีวิต
                </label>
                <input
                  type="text"
                  name="life_insurance_number"
                  value={formData.life_insurance_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลเงินเดือนและสวัสดิการ */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-pink-100 p-3 rounded-lg">
                <DollarSign className="text-pink-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                ข้อมูลเงินเดือนและสวัสดิการ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เงินเดือน (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ค่าแรงรายวัน (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="daily_wage"
                  value={formData.daily_wage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ค่าแรงรายชั่วโมง (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="hourly_wage"
                  value={formData.hourly_wage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เงินสมทบประกันสังคม
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="social_security_contribution"
                  value={formData.social_security_contribution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  กองทุนสำรองเลี้ยงชีพ (บริษัท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="company_provident_fund"
                  value={formData.company_provident_fund}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  กองทุนสำรองเลี้ยงชีพ (พนักงาน)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="employee_provident_fund"
                  value={formData.employee_provident_fund}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หัก กยศ.
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="student_loan_deduction"
                  value={formData.student_loan_deduction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หัก ภ.ง.ด.91
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="retirement_mutual_fund_deduction"
                  value={formData.retirement_mutual_fund_deduction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หักเบี้ย RMF
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="rmf_deduction"
                  value={formData.rmf_deduction}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เบี้ยประกันชีวิต
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="life_insurance_premium"
                  value={formData.life_insurance_premium}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ดอกเบี้ยเงินกู้ที่อยู่อาศัย
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="housing_loan_interest"
                  value={formData.housing_loan_interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ปุ่มบันทึก */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="button"
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
