// Import polyfill first
import './polyfill.js';
import { SpreadsheetProcessor } from './spreadsheet-utils';

async function main() {
  const processor = new SpreadsheetProcessor();
  
  try {
    console.log('Loading Excel file...');
    await processor.loadDataFromExcel('/Users/arunmanoharan/Documents/AI/PA_Tool/PA Tool.xlsx');
    
    console.log('Data loaded successfully!');
  
    console.log('\nGetting dropdown values...');
    const dropdownValues = processor.GetDropDownValues();
    
    console.log('\nUnique Programs:');
    console.log(dropdownValues.programs);
    
    console.log('\nUnique CPT Codes:');
    console.log(dropdownValues.cptCodes);
    
    console.log('\nTesting get_criteria method...');
    
    const criteria1 = processor.get_criteria("Vascular", 35391);
    console.log('\nCriteria for Vascular - 35390:');
    if (criteria1) {
      console.log("Inside CRITERIA 1 \n");
      console.log('Clinical Criteria:\n', criteria1["Clinical Criteria"].substring(0, 100) + '...');
      console.log('\nSimplified Clinical Criteria:\n', criteria1["Simplified Clinical Criteria"].substring(0, 100) + '...');
      console.log('\nDocs To Upload:\n', criteria1["Docs To Upload"]);
    } else {
      console.log('No matching criteria found');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();