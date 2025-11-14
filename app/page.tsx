"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  User,
  Plus,
  Edit,
  Upload,
  Trash2,
  Search,
  Filter,
  X,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import ImportData from "@/components/import_data";

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  line_id: string;
  position: string;
  division: string;
  department: string;
  salary: string;
  national_id: string;
  bank_id: string;
  bank_account_number: string;
  tax_identification_number: string;
  social_security_number: string;
  provident_fund_number: string;
  studentloan_number: string;
  retirement_mutual_fund_number: string;
  rmf_number: string;
  life_insurance_number: string;
}

type FilterState = Record<string, string[]>;

const COLUMNS: Array<{
  key: keyof Employee;
  label: string;
  align: "left" | "right";
  format?: "number";
}> = [
  { key: "employee_id", label: "รหัสพนักงาน", align: "left" },
  { key: "name", label: "ชื่อ-นามสกุล", align: "left" },
  { key: "line_id", label: "Line ID", align: "left" },
  { key: "position", label: "ตำแหน่ง", align: "left" },
  { key: "division", label: "ฝ่าย", align: "left" },
  { key: "department", label: "แผนก", align: "left" },
  { key: "salary", label: "เงินเดือน", align: "right", format: "number" },
  { key: "national_id", label: "เลขประจำตัวประชาชน", align: "left" },
  { key: "bank_id", label: "รหัสธนาคาร", align: "left" },
  { key: "bank_account_number", label: "เลขบัญชีธนาคาร", align: "left" },
  {
    key: "tax_identification_number",
    label: "เลขประจำตัวผู้เสียภาษี",
    align: "left",
  },
  { key: "social_security_number", label: "เลขประกันสังคม", align: "left" },
  {
    key: "provident_fund_number",
    label: "เลขกองทุนสำรองเลี้ยชีพ",
    align: "left",
  },
  { key: "studentloan_number", label: "เลข กยศ.", align: "left" },
  { key: "retirement_mutual_fund_number", label: "เลข ภงด.91", align: "left" },
  { key: "rmf_number", label: "เลข RMF", align: "left" },
  { key: "life_insurance_number", label: "เลขประกันชีวิต", align: "left" },
];

// Fixed button styles mapping
const BUTTON_STYLES = {
  blue: "px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
  purple:
    "px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
  lime: "px-6 py-3 bg-gradient-to-r from-lime-600 to-lime-700 text-white rounded-lg font-semibold hover:from-lime-700 hover:to-lime-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2",
};

export default function Page() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortedData, setSortedData] = useState<Employee[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  const fetchEmployees = useCallback(async (search = "") => {
    try {
      const url = search
        ? `/api/employees?search=${encodeURIComponent(search)}`
        : "/api/employees";
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) setEmployees(result.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredEmployees = useMemo(() => {
    let result = sortedData.length ? sortedData : employees;
    Object.entries(filters).forEach(([col, vals]) => {
      if (vals.length) {
        result = result.filter((emp) =>
          vals.includes(emp[col as keyof Employee]?.toString() || "-")
        );
      }
    });
    return result;
  }, [employees, filters, sortedData]);

  const handleSearch = () =>
    searchQuery.trim() ? fetchEmployees(searchQuery) : fetchEmployees();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("คุณต้องการลบข้อมูลพนักงานนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/employees?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        alert("ลบข้อมูลสำเร็จ!");
        fetchEmployees();
      } else alert("เกิดข้อผิดพลาด: " + result.error);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/employee_update?id=${id}`);
  };

  const formatValue = (value: any, format?: string) => {
    if (!value) return "-";
    if (format === "number") {
      const num = typeof value === "string" ? parseFloat(value) : value;
      return isNaN(num)
        ? value
        : new Intl.NumberFormat("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(num);
    }
    return value;
  };

  const FilterDropdown = ({
    column,
    label,
  }: {
    column: keyof Employee;
    label: string;
  }) => {
    const uniqueValues = useMemo(
      () =>
        Array.from(
          new Set(employees.map((emp) => emp[column]?.toString() || "-"))
        ).sort(),
      [column]
    );
    const selectedValues = filters[column] || [];
    const isActive = selectedValues.length > 0;

    const handleSort = (dir: "asc" | "desc") => {
      const sorted = [...filteredEmployees].sort((a, b) => {
        const aVal = a[column]?.toString() || "";
        const bVal = b[column]?.toString() || "";
        const aNum = parseFloat(aVal),
          bNum = parseFloat(bVal);

        if (!isNaN(aNum) && !isNaN(bNum))
          return dir === "asc" ? aNum - bNum : bNum - aNum;
        return dir === "asc"
          ? aVal.localeCompare(bVal, "th")
          : bVal.localeCompare(aVal, "th");
      });
      setSortedData(sorted);
      setActiveFilter(null);
    };

    const toggleValue = (value: string) => {
      setFilters((prev) => {
        const current = prev[column] || [];
        return {
          ...prev,
          [column]: current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value],
        };
      });
    };

    return (
      <div
        className="relative inline-block"
        ref={activeFilter === column ? filterRef : null}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveFilter(activeFilter === column ? null : column);
          }}
          className={`ml-2 p-1 rounded hover:bg-gray-200 transition-colors ${
            isActive ? "text-blue-600" : "text-gray-400"
          }`}
          title="Filter"
        >
          <Filter size={14} />
        </button>

        {activeFilter === column && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[220px] max-h-[400px] overflow-hidden flex flex-col">
            <div className="p-2 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">
                กรอง: {label}
              </span>
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((prev) => {
                      const n = { ...prev };
                      delete n[column];
                      return n;
                    });
                  }}
                  className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <X size={12} />
                  ล้าง
                </button>
              )}
            </div>

            <div className="border-b border-gray-200 bg-gray-50">
              {["asc", "desc"].map((dir) => (
                <button
                  key={dir}
                  onClick={() => handleSort(dir as "asc" | "desc")}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-gray-700 border-t border-gray-200 first:border-t-0"
                >
                  <span className="text-lg">{dir === "asc" ? "↑" : "↓"}</span>
                  {dir === "asc"
                    ? "เรียงจากน้อยไปมาก (A → Z, 0 → 9)"
                    : "เรียงจากมากไปน้อย (Z → A, 9 → 0)"}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto max-h-[240px]">
              {uniqueValues.map((value) => (
                <label
                  key={value}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(value)}
                    onChange={() => toggleValue(value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 truncate">{value}</span>
                  {selectedValues.includes(value) && (
                    <Check size={14} className="ml-auto text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const activeFiltersCount = Object.values(filters).filter(
    (f) => f.length
  ).length;

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
              {[
                {
                  label: "เพิ่มพนักงานใหม่",
                  icon: Plus,
                  color: "blue" as const,
                  path: "/employee",
                },
                {
                  label: "อัปเดตข้อมูลพนักงาน",
                  icon: Edit,
                  color: "purple" as const,
                  path: "/employee_update",
                },
                {
                  label: "นำเข้าข้อมูลพนักงาน",
                  icon: Upload,
                  color: "lime" as const,
                  onClick: () => setShowImportPopup(true),
                },
              ].map(({ label, icon: Icon, color, path, onClick }) => (
                <button
                  key={label}
                  onClick={onClick || (() => router.push(path!))}
                  className={BUTTON_STYLES[color]}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="ค้นหา: ชื่อ, รหัส, แผนก, ฝ่าย, ตำแหน่ง"
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

        {activeFiltersCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">
                กรองอยู่ {activeFiltersCount} คอลัมน์
              </span>
            </div>
            <button
              onClick={() => setFilters({})}
              className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
            >
              <X size={16} />
              ล้างทั้งหมด
            </button>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="bg-blue-100 p-3 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">รายชื่อพนักงาน</h2>
            <span className="ml-auto bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              แสดง {filteredEmployees.length} / {employees.length} คน
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <User size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-semibold">ไม่พบข้อมูลพนักงาน</p>
                <p className="text-sm">
                  {activeFiltersCount > 0
                    ? "ลองปรับเงื่อนไขการกรองใหม่"
                    : "กรุณาเพิ่มข้อมูลพนักงานใหม่"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    {COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        className={`px-6 py-4 text-${col.align} text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap`}
                      >
                        <div
                          className={`flex items-center ${
                            col.align === "right" ? "justify-end" : ""
                          }`}
                        >
                          {col.label}
                          <FilterDropdown
                            column={col.key as keyof Employee}
                            label={col.label}
                          />
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((emp, i) => (
                    <tr
                      key={emp.id}
                      onClick={() =>
                        router.push(`/employee_update?id=${emp.id}`)
                      }
                      className={`hover:bg-blue-50 transition-colors cursor-pointer ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {COLUMNS.map((col) => (
                        <td
                          key={col.key}
                          className={`px-6 py-4 whitespace-nowrap text-${
                            col.align
                          } text-sm ${
                            col.key === "employee_id"
                              ? "font-semibold text-blue-600"
                              : col.key === "name"
                              ? "font-medium text-gray-900"
                              : col.key === "salary"
                              ? "font-semibold text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          {formatValue(
                            emp[col.key as keyof Employee],
                            col.format
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => handleEdit(emp.id, e)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(emp.id, e)}
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
