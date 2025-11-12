"use client";

import React, { useState, useEffect, Suspense } from "react";
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
  MapPin,
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

// Component ที่ใช้ useSearchParams
function EmployeeUpdateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
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
    tax_identification_number: "",
    social_security_number: "",
    provident_fund_number: "",
    studentloan_number: "",
    retirement_mutual_fund_number: "",
    rmf_number: "",
    life_insurance_number: "",

    // หักค่าเบี้ย
    social_security_contribution: "",
    company_provident_fund: "",
    employee_provident_fund: "",
    student_loan_deduction: "",
    retirement_mutual_fund_deduction: "",
    rmf_deduction: "",
    life_insurance_premium: "",
    housing_loan_interest: "",
  });

  const [registeredDistricts, setRegisteredDistricts] = useState<string[]>([]);
  const [registeredSubdistricts, setRegisteredSubdistricts] = useState
    string[]
  >([]);
  const [currentDistricts, setCurrentDistricts] = useState<string[]>([]);
  const [currentSubdistricts, setCurrentSubdistricts] = useState<string[]>([]);

  const provinces = getProvinces();

  useEffect(() => {
    if (idFromUrl) {
      fetchEmployeeById(idFromUrl);
    }
  }, [idFromUrl]);

  const fetchEmployeeById = async (id: string) => {
    try {
      const response = await fetch(`/api/employees?id=${id}`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        const employee = result.data[0];
        loadEmployeeData(employee);
      } else {
        console.log("ไม่พบข้อมูลพนักงาน");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("กรุณากรอกคำค้นหา");
      return;
    }

    try {
      const response = await fetch(
        `/api/employees?search=${encodeURIComponent(searchQuery)}`
      );
      const result = await response.json();

      if (result.success) {
        setEmployees(result.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching:", error);
      alert("ไม่สามารถค้นหาข้อมูลได้");
    }
  };

  const loadEmployeeData = (employee: any) => {
    setFormData({
      id: employee.id || "",
      employee_id: employee.employee_id || "",
      title_name: employee.title_name || "",
      name: employee.name || "",
      gender: employee.gender || "",
      nickname: employee.nickname || "",
      birth_date: employee.birth_date || "",
      mobile_phone: employee.mobile_phone || "",
      national_id: employee.national_id || "",
      national_idcard_issue_date: employee.national_idcard_issue_date || "",
      national_idcard_expiry_date: employee.national_idcard_expiry_date || "",
      national_idcard_issued_place: employee.national_idcard_issued_place || "",
      nationality: employee.nationality || "",
      race: employee.race || "",
      religion: employee.religion || "",
      height: employee.height ? employee.height.toString() : "",
      weight: employee.weight ? employee.weight.toString() : "",
      position: employee.position || "",
      division: employee.division || "",
      department: employee.department || "",
      employee_type: employee.employee_type || "",
      shift: employee.shift || "",
      start_time: employee.start_time || "",
      start_lunch: employee.start_lunch || "",
      end_lunch: employee.end_lunch || "",
      end_time: employee.end_time || "",
      start_working_date: employee.start_working_date || "",
      end_working_date: employee.end_working_date || "",
      salary: employee.salary ? employee.salary.toString() : "",
      daily_wage: employee.daily_wage ? employee.daily_wage.toString() : "",
      hourly_wage: employee.hourly_wage ? employee.hourly_wage.toString() : "",

      registered_house_no: employee.registered_house_no || "",
      registered_village: employee.registered_village || "",
      registered_soi: employee.registered_soi || "",
      registered_road: employee.registered_road || "",
      registered_province: employee.registered_province || "",
      registered_district: employee.registered_district || "",
      registered_subdistrict: employee.registered_subdistrict || "",
      registered_postcode: employee.registered_postcode || "",
      current_house_no: employee.current_house_no || "",
      current_village: employee.current_village || "",
      current_soi: employee.current_soi || "",
      current_road: employee.current_road || "",
      current_province: employee.current_province || "",
      current_district: employee.current_district || "",
      current_subdistrict: employee.current_subdistrict || "",
      current_postcode: employee.current_postcode || "",

      marital_status: employee.marital_status || "",
      spouse_title_name: employee.spouse_title_name || "",
      spouse_name: employee.spouse_name || "",
      number_of_children: employee.number_of_children || "",

      bank_id: employee.bank_id || "",
      bank_account_number: employee.bank_account_number || "",

      tax_identification_number: employee.tax_identification_number || "",
      social_security_number: employee.social_security_number || "",
      provident_fund_number: employee.provident_fund_number || "",
      studentloan_number: employee.studentloan_number || "",
      retirement_mutual_fund_number:
        employee.retirement_mutual_fund_number || "",
      rmf_number: employee.rmf_number || "",
      life_insurance_number: employee.life_insurance_number || "",

      social_security_contribution: employee.social_security_contribution
        ? employee.social_security_contribution.toString()
        : "",
      company_provident_fund: employee.company_provident_fund
        ? employee.company_provident_fund.toString()
        : "",
      employee_provident_fund: employee.employee_provident_fund
        ? employee.employee_provident_fund.toString()
        : "",
      student_loan_deduction: employee.student_loan_deduction
        ? employee.student_loan_deduction.toString()
        : "",
      retirement_mutual_fund_deduction:
        employee.retirement_mutual_fund_deduction
          ? employee.retirement_mutual_fund_deduction.toString()
          : "",
      rmf_deduction: employee.rmf_deduction
        ? employee.rmf_deduction.toString()
        : "",
      life_insurance_premium: employee.life_insurance_premium
        ? employee.life_insurance_premium.toString()
        : "",
      housing_loan_interest: employee.housing_loan_interest
        ? employee.housing_loan_interest.toString()
        : "",
    });
    setSelectedEmployeeId(employee.id);
    setShowResults(false);
  };

  const handleChange = (
    e: React.ChangeEvent
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  useEffect(() => {
    if (formData.current_province) {
      const districts = getDistricts(formData.current_province);
      setCurrentDistricts(districts);
    }
  }, [formData.current_province]);

  useEffect(() => {
    if (formData.current_province && formData.current_district) {
      const subdistricts = getSubdistricts(
        formData.current_province,
        formData.current_district
      );
      setCurrentSubdistricts(subdistricts);
    }
  }, [formData.current_district]);

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

  const handleSubmit = async () => {
    try {
      if (!formData.id) {
        alert("กรุณาเลือกพนักงานที่ต้องการอัปเดต");
        return;
      }

      if (!formData.employee_id || !formData.name || !formData.national_id) {
        alert("กรุณากรอกข้อมูลที่จำเป็น (รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน)");
        return;
      }

      const cleanedData = {
        id: formData.id,
        employee_id: formData.employee_id,
        title_name: formData.title_name,
        name: formData.name,
        gender: formData.gender,
        nickname: formData.nickname,
        birth_date: formData.birth_date,
        mobile_phone: formData.mobile_phone,
        national_id: formData.national_id,
        national_idcard_issue_date: formData.national_idcard_issue_date,
        national_idcard_expiry_date: formData.national_idcard_expiry_date,
        national_idcard_issued_place: formData.national_idcard_issued_place,
        nationality: formData.nationality,
        race: formData.race,
        religion: formData.religion,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        position: formData.position,
        division: formData.division,
        department: formData.department,
        employee_type: formData.employee_type,
        shift: formData.shift,
        start_time: formData.start_time,
        start_lunch: formData.start_lunch,
        end_lunch: formData.end_lunch,
        end_time: formData.end_time,
        start_working_date: formData.start_working_date,
        end_working_date: formData.end_working_date,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        daily_wage: formData.daily_wage
          ? parseFloat(formData.daily_wage)
          : null,
        hourly_wage: formData.hourly_wage
          ? parseFloat(formData.hourly_wage)
          : null,

        registered_house_no: formData.registered_house_no,
        registered_village: formData.registered_village,
        registered_soi: formData.registered_soi,
        registered_road: formData.registered_road,
        registered_province: formData.registered_province,
        registered_district: formData.registered_district,
        registered_subdistrict: formData.registered_subdistrict,
        registered_postcode: formData.registered_postcode,

        current_house_no: formData.current_house_no,
        current_village: formData.current_village,
        current_soi: formData.current_soi,
        current_road: formData.current_road,
        current_province: formData.current_province,
        current_district: formData.current_district,
        current_subdistrict: formData.current_subdistrict,
        current_postcode: formData.current_postcode,

        marital_status: formData.marital_status,
        spouse_title_name: formData.spouse_title_name,
        spouse_name: formData.spouse_name,
        number_of_children: formData.number_of_children,

        bank_id: formData.bank_id,
        bank_account_number: formData.bank_account_number,

        tax_identification_number: formData.tax_identification_number,
        social_security_number: formData.social_security_number,
        provident_fund_number: formData.provident_fund_number,
        studentloan_number: formData.studentloan_number,
        retirement_mutual_fund_number: formData.retirement_mutual_fund_number,
        rmf_number: formData.rmf_number,
        life_insurance_number: formData.life_insurance_number,

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
        retirement_mutual_fund_deduction:
          formData.retirement_mutual_fund_deduction
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

      const response = await fetch("/api/employees", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.success) {
        alert("อัปเดตข้อมูลพนักงานสำเร็จ!");
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
            แบบฟอร์มอัปเดตข้อมูลพนักงาน
          </h1>
          <p className="text-gray-600">ค้นหาและอัปเดตข้อมูลพนักงาน</p>
        </div>

        {/* ช่องค้นหา */}
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

          {/* ผลการค้นหา */}
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
                  step="0.01"
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
                  step="0.01"
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
                  คำนำหน้าชื่อ คู่สมรส
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
                  ชื่อ-นามสกุล คู่สมรส
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

            {/* ที่อยู่ตามทะเบียนบ้าน */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4">ที่อยู่ตามบัตรประชาชน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขที่ *
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

            {/* ที่อยู่ปัจจุบัน */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4 mt-8">ที่อยู่ปัจจุบัน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  เลขที่ *
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
                  วันที่ออกงาน
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

// Component หลักที่ export พร้อม Suspense
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
