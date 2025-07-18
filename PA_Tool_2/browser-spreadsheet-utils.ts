// Browser-compatible version of spreadsheet utilities
import { sampleData } from './sample-data';

export interface SpreadsheetData {
  Program: string;
  "CPT Code": number;
  "Clinical Criteria": string;
  "Simplified Clinical Criteria": string;
  "Docs to Upload": string;
}

export interface DropdownValues {
  programs: string[];
  cptCodes: number[];
}

export interface CriteriaResult {
  "Clinical Criteria": string;
  "Simplified Clinical Criteria": string;
  "Docs To Upload": string;
}

export class BrowserSpreadsheetProcessor {
  private data: SpreadsheetData[] = [];

  constructor() {
    // Load sample data
    this.data = sampleData;
  }

  GetDropDownValues(): DropdownValues {
    const programs = [...new Set(this.data.map(row => row.Program))];
    const cptCodes = [...new Set(this.data.map(row => row["CPT Code"]))];
    
    return {
      programs: programs.filter(value => value !== null && value !== undefined),
      cptCodes: cptCodes.filter(value => value !== null && value !== undefined)
    };
  }

  get_criteria(program: string, cptCode: number): CriteriaResult | null {
    const matchingRow = this.data.find(row => 
      row.Program === program && row["CPT Code"] === cptCode
    );

    if (!matchingRow) {
      return null;
    }

    return {
      "Clinical Criteria": matchingRow["Clinical Criteria"],
      "Simplified Clinical Criteria": matchingRow["Simplified Clinical Criteria"],
      "Docs To Upload": matchingRow["Docs to Upload"]
    };
  }
}