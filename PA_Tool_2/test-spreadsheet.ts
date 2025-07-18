import { SpreadsheetProcessor } from './spreadsheet-utils';

async function testSpreadsheetProcessor() {
  const processor = new SpreadsheetProcessor();
  
  try {
    console.log('Loading Excel file...');
    await processor.loadDataFromExcel('/Users/arunmanoharan/Documents/AI/PA_Tool/PA Tool.xlsx');
    
    console.log('Data loaded successfully!');
    
    const dataFrame = processor.getData();
    if (dataFrame) {
      console.log('\nDataFrame info:');
      console.log('Shape:', dataFrame.shape);
      console.log('Columns:', dataFrame.columns);
      
      console.log('\nFirst few rows:');
      console.log(dataFrame.head().values);
    }
    
    console.log('\nGetting dropdown values...');
    const dropdownValues = processor.GetDropDownValues();
    
    console.log('\nUnique Programs:');
    console.log(dropdownValues.programs);
    
    console.log('\nUnique CPT Codes:');
    console.log(dropdownValues.cptCodes);
    
    console.log('\nTesting get_criteria method...');
    
    const criteria1 = processor.get_criteria("Vascular", 35390);
    console.log('\nCriteria for Vascular - 35390:');
    if (criteria1) {
      console.log("Inside Criteria 1")
      console.log('Clinical Criteria:', criteria1["Clinical Criteria"].substring(0, 100) + '...');
      console.log('Simplified Clinical Criteria:', criteria1["Simplified Clinical Criteria"].substring(0, 100) + '...');
      console.log('Docs To Upload:', criteria1["Docs To Upload"]);
    } else {
      console.log('No matching criteria found');
    }
    
    const criteria2 = processor.get_criteria("Intravascular Ultrasound", 37252);
    console.log('\nCriteria for Intravascular Ultrasound - 37252:');
    if (criteria2) {
      console.log("Inside Criteria 2")
      console.log('Clinical Criteria:', criteria2["Clinical Criteria"].substring(0, 100) + '...');
      console.log('Simplified Clinical Criteria:', criteria2["Simplified Clinical Criteria"].substring(0, 100) + '...');
      console.log('Docs To Upload:', criteria2["Docs To Upload"]);
    } else {
      console.log('No matching criteria found');
    }
    
    const criteriaNonExistent = processor.get_criteria("NonExistent", 99999);
    console.log('\nTesting non-existent combination:');
    console.log('Result:', criteriaNonExistent);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSpreadsheetProcessor();