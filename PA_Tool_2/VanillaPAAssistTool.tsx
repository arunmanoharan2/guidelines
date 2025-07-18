import React, { useState, useEffect } from 'react';
import { BrowserSpreadsheetProcessor, DropdownValues, CriteriaResult } from './browser-spreadsheet-utils';

const VanillaPAAssistTool: React.FC = () => {
  const [processor, setProcessor] = useState<BrowserSpreadsheetProcessor | null>(null);
  const [dropdownValues, setDropdownValues] = useState<DropdownValues | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCPTCode, setSelectedCPTCode] = useState<string>('');
  const [criteriaResult, setCriteriaResult] = useState<CriteriaResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const proc = new BrowserSpreadsheetProcessor();
        const dropdowns = proc.GetDropDownValues();
        
        setProcessor(proc);
        setDropdownValues(dropdowns);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleGetCriteria = async () => {
    if (!processor || !selectedProgram || !selectedCPTCode) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = processor.get_criteria(selectedProgram, parseInt(selectedCPTCode));
      setCriteriaResult(result);
      
      if (!result) {
        setError('No criteria found for the selected Program and CPT Code combination.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get criteria');
      setCriteriaResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <p key={index} style={{ margin: '8px 0', lineHeight: '1.5' }}>
        {line}
      </p>
    ));
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f7fafc',
      minHeight: '100vh'
    },
    banner: {
      textAlign: 'center' as const,
      marginBottom: '30px'
    },
    title: {
      fontSize: '36px',
      color: '#2563eb',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#6b7280'
    },
    card: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    },
    inputRow: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    },
    inputGroup: {
      flex: '1'
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      marginBottom: '8px',
      color: '#374151'
    },
    select: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white'
    },
    button: {
      padding: '12px 24px',
      fontSize: '16px',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    twoColumn: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    greenTitle: {
      color: '#059669'
    },
    purpleTitle: {
      color: '#7c3aed'
    },
    orangeTitle: {
      color: '#ea580c'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading PA Assist Tool...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Section 1: Banner */}
      <div style={styles.banner}>
        <h1 style={styles.title}>PA Assist Tool</h1>
        <p style={styles.subtitle}>Prior Authorization Clinical Criteria Assistant</p>
      </div>

      {/* Section 2: Input Controls */}
      <div style={styles.card}>
        <h2 style={{ ...styles.sectionTitle, textAlign: 'center' }}>Select Criteria</h2>
        
        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Program</label>
            <select
              style={styles.select}
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              <option value="">Select Program</option>
              {dropdownValues?.programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>CPT Code</label>
            <select
              style={styles.select}
              value={selectedCPTCode}
              onChange={(e) => setSelectedCPTCode(e.target.value)}
            >
              <option value="">Select CPT Code</option>
              {dropdownValues?.cptCodes.map((code) => (
                <option key={code} value={code.toString()}>
                  {code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 3: Get Criteria Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            style={{
              ...styles.button,
              ...(!selectedProgram || !selectedCPTCode || isSubmitting ? styles.buttonDisabled : {})
            }}
            onClick={handleGetCriteria}
            disabled={!selectedProgram || !selectedCPTCode || isSubmitting}
          >
            {isSubmitting ? 'Getting Criteria...' : 'Get Criteria'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Section 4: Two Column Layout */}
      {criteriaResult && (
        <div style={styles.twoColumn}>
          <div style={styles.card}>
            <h3 style={{ ...styles.sectionTitle, ...styles.greenTitle }}>
              Simplified Clinical Criteria
            </h3>
            <div>
              {formatText(criteriaResult["Simplified Clinical Criteria"])}
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ ...styles.sectionTitle, ...styles.purpleTitle }}>
              Docs to Upload
            </h3>
            <div>
              {formatText(criteriaResult["Docs To Upload"])}
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Clinical Criteria */}
      {criteriaResult && (
        <div style={styles.card}>
          <h3 style={{ ...styles.sectionTitle, ...styles.orangeTitle }}>
            Clinical Criteria
          </h3>
          <div>
            {formatText(criteriaResult["Clinical Criteria"])}
          </div>
        </div>
      )}
    </div>
  );
};

export default VanillaPAAssistTool;