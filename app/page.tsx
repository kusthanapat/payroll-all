"use client";

import React, { useState, useEffect } from "react";
import { User, Plus, Edit, Upload, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import ImportData from "@/components/import_data";

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  division: string;
  department: string;
  salary: number;
  company_provident_fund: number;
  employee_provident_fund: number;
  social_security_contribution: number;
  life_insurance_premium: number;
  housing_loan_interest: number;
  teacher_fund: number;
  rmf: number;
}

export default function Page() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showImportPopup, setShowImportPopup] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchEmployees();
      return;
    }

    try {
      // ค้นหาทั้งจากชื่อและรหัสพนักงาน
      const response = await fetch(`/api/employees?search=${searchQuery}`);
      const result = await response.json();
      if (result.success) {
        setEmployees(result.data);
      }
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบข้อมูลพนักงานนี้ใช่หรือไม่?")) return;

    try {
      const response = await fetch(`/api/employees?id=${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        alert("ลบข้อมูลสำเร็จ!");
        fetchEmployees();
      } else {
        alert("เกิดข้อผิดพลาด: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "-";
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            จัดการข้อมูลพนักงาน
          </h1>
          <p className="text-gray-600">ระบบจัดการข้อมูลพนักงานและสวัสดิการ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push("/employee")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                เพิ่มพนักงานใหม่
              </button>

              <button
                onClick={() => router.push("/employee_update")}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Edit size={20} />
                อัปเดตข้อมูลพนักงาน
              </button>

              <button
                onClick={() => setShowImportPopup(true)}
                className="px-6 py-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white rounded-lg font-semibold hover:from-lime-700 hover:to-lime-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Upload size={20} />
                นำเข้าข้อมูลพนักงาน
              </button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="ค้นหาชื่อหรือรหัสพนักงาน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">รายชื่อพนักงาน</h2>
            <span className="ml-auto bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              ทั้งหมด {employees.length} คน
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : employees.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <User size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-semibold">ไม่พบข้อมูลพนักงาน</p>
                <p className="text-sm">กรุณาเพิ่มข้อมูลพนักงานใหม่</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      รหัสพนักงาน
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ชื่อ-นามสกุล
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ตำแหน่ง
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ฝ่าย
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      แผนก
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      เงินเดือน
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      กองทุน (บริษัท)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      กองทุน (พนักงาน)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ประกันสังคม
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ประกันชีวิต
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ดอกเบี้ยที่อยู่
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      กองทุนครู
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      RMF
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee, index) => (
                    <tr
                      key={employee.id}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-blue-600">
                          {employee.employee_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {employee.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.position || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.division || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {employee.department || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-semibold text-green-600">
                          {formatNumber(employee.salary)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.company_provident_fund)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.employee_provident_fund)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.social_security_contribution)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.life_insurance_premium)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.housing_loan_interest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.teacher_fund)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                        {formatNumber(employee.rmf)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              router.push(`/employee_update?id=${employee.id}`)
                            }
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="ลบ"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <ImportData
        isOpen={showImportPopup}
        onClose={() => setShowImportPopup(false)}
        onImportSuccess={fetchEmployees}
      />
    </div>
  );
}
