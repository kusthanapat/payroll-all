{/* employee.tsx */}
"use client";

import React, { useState } from 'react';
import { User, Briefcase, Calendar, CreditCard, Clock, DollarSign } from 'lucide-react';
import 'react-time-picker/dist/TimePicker.css';
import TimePicker from 'react-time-picker';

export default function Page() {
  const [formData, setFormData] = useState({
    employee_id: '',
    title_name: '',
    name: '',
    gender: '',
    nickname: '',
    birth_date: '',
    national_id: '',
    national_idcard_issue_date: '',
    national_idcard_expiry_date: '',
    national_idcard_issued_place: '',
    address: '',
    position: '',
    division: '',
    department: '',
    nationality: '',
    race: '',
    religion: '',
    height: '',
    weight: '',
    marital_status: '',
    bank_id: '',
    bank_account_number: '',
    tax_identification_number: '',
    social_security_number: '',
    provident_fund_number: '',
    shift: '',
    start_time: '',
    start_lunch: '',
    end_lunch: '',
    end_time: '',
    start_working_date: '',
    salary: '',
    daily_wage: '',
    hourly_wage: '',
    company_provident_fund: '',
    employee_provident_fund: '',
    social_security_contribution: '',
    life_insurance_premium: '',
    housing_loan_interest: '',
    teacher_fund: '',
    rmf: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.employee_id || !formData.name || !formData.national_id) {
        alert('กรุณากรอกข้อมูลที่จำเป็น (รหัสพนักงาน, ชื่อ, เลขบัตรประชาชน)');
        return;
      }

      const cleanedData = {
        ...formData,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        daily_wage: formData.daily_wage ? parseFloat(formData.daily_wage) : null,
        hourly_wage: formData.hourly_wage ? parseFloat(formData.hourly_wage) : null,
        company_provident_fund: formData.company_provident_fund ? parseFloat(formData.company_provident_fund) : null,
        employee_provident_fund: formData.employee_provident_fund ? parseFloat(formData.employee_provident_fund) : null,
        social_security_contribution: formData.social_security_contribution ? parseFloat(formData.social_security_contribution) : null,
        life_insurance_premium: formData.life_insurance_premium ? parseFloat(formData.life_insurance_premium) : null,
        housing_loan_interest: formData.housing_loan_interest ? parseFloat(formData.housing_loan_interest) : null,
        teacher_fund: formData.teacher_fund ? parseFloat(formData.teacher_fund) : null,
        rmf: formData.rmf ? parseFloat(formData.rmf) : null,
      };

      console.log('Sending data:', cleanedData);

      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (result.success) {
        alert('บันทึกข้อมูลพนักงานสำเร็จ!');
        console.log('Saved employee:', result.data);
        
        setFormData({
          employee_id: '',
          title_name: '',
          name: '',
          gender: '',
          nickname: '',
          birth_date: '',
          national_id: '',
          national_idcard_issue_date: '',
          national_idcard_expiry_date: '',
          national_idcard_issued_place: '',
          address: '',
          position: '',
          division: '',
          department: '',
          nationality: '',
          race: '',
          religion: '',
          height: '',
          weight: '',
          marital_status: '',
          bank_id: '',
          bank_account_number: '',
          tax_identification_number: '',
          social_security_number: '',
          provident_fund_number: '',
          shift: '',
          start_time: '',
          start_lunch: '',
          end_lunch: '',
          end_time: '',
          start_working_date: '',
          salary: '',
          daily_wage: '',
          hourly_wage: '',
          company_provident_fund: '',
          employee_provident_fund: '',
          social_security_contribution: '',
          life_insurance_premium: '',
          housing_loan_interest: '',
          teacher_fund: '',
          rmf: ''
        });
      } else {
        alert('เกิดข้อผิดพลาด: ' + result.error);
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('ไม่สามารถเชื่อมต่อกับ server ได้');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">แบบฟอร์มข้อมูลพนักงาน</h1>
          <p className="text-gray-600">กรุณากรอกข้อมูลพนักงาน</p>
        </div>
        
        <div className="space-y-6">
          {/* ข้อมูลส่วนตัว */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">ข้อมูลส่วนตัว</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสพนักงาน *</label>
                <input
                  type="text"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">คำนำหน้าชื่อ *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อเล่น</label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เพศ *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">วันเกิด *</label>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สัญชาติ *</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เชื้อชาติ *</label>
                <input
                  type="text"
                  name="race"
                  value={formData.race}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ศาสนา</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สถานภาพ *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">ส่วนสูง (ซม.)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">น้ำหนัก (กก.)</label>
                <input
                  type="number"
                  step="0.01"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">ที่อยู่ *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
              <h2 className="text-2xl font-bold text-gray-800">ข้อมูลบัตรประชาชน</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เลขบัตรประชาชน *</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่ออกบัตร *</label>
                <input
                  type="date"
                  name="national_idcard_issue_date"
                  value={formData.national_idcard_issue_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่หมดอายุ *</label>
                <input
                  type="date"
                  name="national_idcard_expiry_date"
                  value={formData.national_idcard_expiry_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">สถานที่ออกบัตร *</label>
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
              <h2 className="text-2xl font-bold text-gray-800">ข้อมูลการทำงาน</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ตำแหน่ง *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ฝ่าย *</label>
                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">แผนก *</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">วันที่เริ่มงาน *</label>
                <input
                  type="date"
                  name="start_working_date"
                  value={formData.start_working_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">กะการทำงาน</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">เวลาเริ่มงาน</label>
                <TimePicker
                  onChange={(value) => setFormData(prev => ({ ...prev, start_time: value || '' }))}
                  value={formData.start_time}
                  disableClock
                  format="HH:mm"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เวลาพักเที่ยง (เริ่ม)</label>
                <TimePicker
                  onChange={(value) => setFormData(prev => ({ ...prev, start_lunch: value || '' }))}
                  value={formData.start_lunch}
                  disableClock
                  format="HH:mm"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เวลาพักเที่ยง (สิ้นสุด)</label>
                <TimePicker
                  onChange={(value) => setFormData(prev => ({ ...prev, end_lunch: value || '' }))}
                  value={formData.end_lunch}
                  disableClock
                  format="HH:mm"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เวลาเลิกงาน</label>
                <TimePicker
                  onChange={(value) => setFormData(prev => ({ ...prev, end_time: value || '' }))}
                  value={formData.end_time}
                  disableClock
                  format="HH:mm"
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
              <h2 className="text-2xl font-bold text-gray-800">ข้อมูลเงินเดือนและสวัสดิการ</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เงินเดือน (บาท)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">ค่าแรงรายวัน (บาท)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">ค่าแรงรายชั่วโมง (บาท)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">กองทุนสำรองเลี้ยงชีพ (บริษัท)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">กองทุนสำรองเลี้ยงชีพ (พนักงาน)</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">เงินสมทบประกันสังคม</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">เบี้ยประกันชีวิต</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">ดอกเบี้ยเงินกู้ที่อยู่อาศัย</label>
                <input
                  type="number"
                  step="0.01"
                  name="housing_loan_interest"
                  value={formData.housing_loan_interest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">กองทุนครู</label>
                <input
                  type="number"
                  step="0.01"
                  name="teacher_fund"
                  value={formData.teacher_fund}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">RMF</label>
                <input
                  type="number"
                  step="0.01"
                  name="rmf"
                  value={formData.rmf}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
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
              <h2 className="text-2xl font-bold text-gray-800">ข้อมูลธนาคารและเลขประจำตัว</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">รหัสธนาคาร *</label>
                <input
                  type="text"
                  name="bank_id"
                  value={formData.bank_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เลขบัญชีธนาคาร *</label>
                <input
                  type="text"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เลขประจำตัวผู้เสียภาษี</label>
                <input
                  type="text"
                  name="tax_identification_number"
                  value={formData.tax_identification_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เลขประกันสังคม</label>
                <input
                  type="text"
                  name="social_security_number"
                  value={formData.social_security_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">เลขกองทุนสำรองเลี้ยงชีพ</label>
                <input
                  type="text"
                  name="provident_fund_number"
                  value={formData.provident_fund_number}
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
              onClick={() => setFormData({
                employee_id: '',
                title_name: '',
                name: '',
                gender: '',
                nickname: '',
                birth_date: '',
                national_id: '',
                national_idcard_issue_date: '',
                national_idcard_expiry_date: '',
                national_idcard_issued_place: '',
                address: '',
                position: '',
                division: '',
                department: '',
                nationality: '',
                race: '',
                religion: '',
                height: '',
                weight: '',
                marital_status: '',
                bank_id: '',
                bank_account_number: '',
                tax_identification_number: '',
                social_security_number: '',
                provident_fund_number: '',
                shift: '',
                start_time: '',
                start_lunch: '',
                end_lunch: '',
                end_time: '',
                start_working_date: '',
                salary: '',
                daily_wage: '',
                hourly_wage: '',
                company_provident_fund: '',
                employee_provident_fund: '',
                social_security_contribution: '',
                life_insurance_premium: '',
                housing_loan_interest: '',
                teacher_fund: '',
                rmf: ''
              })}
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