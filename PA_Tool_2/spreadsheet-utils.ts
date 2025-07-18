const dfd = require("danfojs");
const XLSX = require("xlsx");

interface SpreadsheetData {
  Program: string;
  "CPT Code": string;
  "Clinical Criteria": string;
  "Simplified Clinical Criteria": string;
  "Docs To Upload": string;
}

interface DropdownValues {
  programs: string[];
  cptCodes: string[];
}

interface CriteriaResult {
  "Clinical Criteria": string;
  "Simplified Clinical Criteria": string;
  "Docs To Upload": string;
}

class SpreadsheetProcessor {
  private dataFrame: any = null;

  async loadData(filePath: string): Promise<void> {
    try {
      this.dataFrame = await dfd.readCSV(filePath);
    } catch (error) {
      throw new Error(`Failed to load data from ${filePath}: ${error}`);
    }
  }

  async loadDataFromExcel(filePath: string, sheetName?: string): Promise<void> {
    try {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[sheetName || workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      this.dataFrame = new dfd.DataFrame(jsonData);
    } catch (error) {
      throw new Error(`Failed to load Excel data from ${filePath}: ${error}`);
    }
  }

  GetDropDownValues(): DropdownValues {
    if (!this.dataFrame) {
      throw new Error("Data not loaded. Please call loadData() first.");
    }

    const programColumn = this.dataFrame.column("Program");
    const cptCodeColumn = this.dataFrame.column("CPT Code");

    const uniquePrograms = programColumn.unique().values as string[];
    const uniqueCptCodes = cptCodeColumn.unique().values as string[];

    return {
      programs: uniquePrograms.filter(value => value !== null && value !== undefined),
      cptCodes: uniqueCptCodes.filter(value => value !== null && value !== undefined)
    };
  }

  get_criteria(program: string, cptCode: number): CriteriaResult | null {
    if (!this.dataFrame) {
      throw new Error("Data not loaded. Please call loadData() first.");
    }

    const data = this.dataFrame.values;
    const columns = this.dataFrame.columns;
    
    const programIndex = columns.indexOf("Program");
    const cptCodeIndex = columns.indexOf("CPT Code");
    const clinicalCriteriaIndex = columns.indexOf("Clinical Criteria");
    const simplifiedCriteriaIndex = columns.indexOf("Simplified Clinical Criteria");
    const docsToUploadIndex = columns.indexOf("Docs to Upload");

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[programIndex] === program && row[cptCodeIndex] === cptCode) {
        return {
          "Clinical Criteria": row[clinicalCriteriaIndex],
          "Simplified Clinical Criteria": row[simplifiedCriteriaIndex],
          "Docs To Upload": row[docsToUploadIndex]
        };
      }
    }

    return null;
  }

  getData(): any {
    return this.dataFrame;
  }
}

export { SpreadsheetProcessor, DropdownValues, SpreadsheetData, CriteriaResult };