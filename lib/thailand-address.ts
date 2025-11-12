import thailandData from "./thailand-data.json";

export interface Address {
  province: string;
  district: string;
  subdistrict: string;
  zipcode: string;
}

// แปลงข้อมูลจาก JSON (Format ของไฟล์ที่คุณดาวน์โหลดมา)
export const thailandAddresses: Address[] = (thailandData as any[]).map(
  (item: any) => ({
    province: item.provinceNameTh,
    district: item.districtNameTh,
    subdistrict: item.subdistrictNameTh,
    zipcode: String(item.postalCode || "").padStart(5, "0"),
  })
);

export const getProvinces = (): string[] => {
  return Array.from(
    new Set(thailandAddresses.map((addr) => addr.province))
  ).sort();
};

export const getDistricts = (province: string): string[] => {
  return Array.from(
    new Set(
      thailandAddresses
        .filter((addr) => addr.province === province)
        .map((addr) => addr.district)
    )
  ).sort();
};

export const getSubdistricts = (
  province: string,
  district: string
): string[] => {
  return Array.from(
    new Set(
      thailandAddresses
        .filter(
          (addr) => addr.province === province && addr.district === district
        )
        .map((addr) => addr.subdistrict)
    )
  ).sort();
};

export const getZipcode = (
  province: string,
  district: string,
  subdistrict: string
): string => {
  const address = thailandAddresses.find(
    (addr) =>
      addr.province === province &&
      addr.district === district &&
      addr.subdistrict === subdistrict
  );
  return address?.zipcode || "";
};
