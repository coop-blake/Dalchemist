import { SubDepartmentMarginEntry } from "./shared";
export class SubDepartmentMargins {
  private static instance: SubDepartmentMargins;

  private subDepartmentMarginsMap = new Map<string, SubDepartmentMarginEntry>();

  private subDepartmentMargins: Array<SubDepartmentMarginEntry> = [];

  private constructor() {}

  public loadSubDepartmentMarginsFrom(
    subDepartmentMargins: Array<SubDepartmentMarginEntry>
  ) {
    this.subDepartmentMargins = subDepartmentMargins;
    subDepartmentMargins.forEach((subDepartmentMargin) => {
      this.subDepartmentMarginsMap.set(
        subDepartmentMargin.SubDepartment.slice(0, 30).trim(),
        subDepartmentMargin
      );
    });
  }

  getSubDepartmentMarginsMap(): Map<string, SubDepartmentMarginEntry> {
    return this.subDepartmentMarginsMap;
  }

  getSubDepartmentMarginsArray() {
    return this.subDepartmentMargins;
  }

  getMarginFor(subDepartment: string): string {
    return this.subDepartmentMarginsMap.get(subDepartment)?.Margin ?? "";
  }

  static getInstance(): SubDepartmentMargins {
    if (!SubDepartmentMargins.instance) {
      SubDepartmentMargins.instance = new SubDepartmentMargins();
    }
    return SubDepartmentMargins.instance;
  }
}
