import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Select,
  Button,
  Text,
  Card,
  CardBody,
  Grid,
  GridItem,
  Alert,
  Spinner,
  Center
} from '@chakra-ui/react';
import { BrowserSpreadsheetProcessor, DropdownValues, CriteriaResult } from './browser-spreadsheet-utils';

interface PAAssistToolProps {}

const BrowserPAAssistTool: React.FC<PAAssistToolProps> = () => {
  const [processor, setProcessor] = useState<BrowserSpreadsheetProcessor | null>(null);
  const [dropdownValues, setDropdownValues] = useState<DropdownValues | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedCPTCode, setSelectedCPTCode] = useState<string>('');
  const [criteriaResult, setCriteriaResult] = useState<CriteriaResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const bgColor = 'gray.50';
  const cardBg = 'white';

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
      <Text key={index} mb={line.trim() ? 2 : 1}>
        {line}
      </Text>
    ));
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Center>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading PA Assist Tool...</Text>
          </VStack>
        </Center>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Section 1: Banner */}
          <Box textAlign="center">
            <Heading size="xl" color="blue.600" mb={2}>
              PA Assist Tool
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Prior Authorization Clinical Criteria Assistant
            </Text>
          </Box>

          {/* Section 2: Input Controls */}
          <Card bg={cardBg} shadow="md">
            <CardBody>
              <VStack spacing={6}>
                <Heading size="md" color="gray.700">
                  Select Criteria
                </Heading>
                
                <HStack spacing={6} width="100%" align="end">
                  <Box flex="1">
                    <Text fontWeight="semibold" mb={2}>
                      Program
                    </Text>
                    <Select
                      placeholder="Select Program"
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      size="lg"
                    >
                      {dropdownValues?.programs.map((program) => (
                        <option key={program} value={program}>
                          {program}
                        </option>
                      ))}
                    </Select>
                  </Box>

                  <Box flex="1">
                    <Text fontWeight="semibold" mb={2}>
                      CPT Code
                    </Text>
                    <Select
                      placeholder="Select CPT Code"
                      value={selectedCPTCode}
                      onChange={(e) => setSelectedCPTCode(e.target.value)}
                      size="lg"
                    >
                      {dropdownValues?.cptCodes.map((code) => (
                        <option key={code} value={code.toString()}>
                          {code}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </HStack>

                {/* Section 3: Get Criteria Button */}
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleGetCriteria}
                  isDisabled={!selectedProgram || !selectedCPTCode}
                  isLoading={isSubmitting}
                  loadingText="Getting Criteria..."
                  width="200px"
                >
                  Get Criteria
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert status="error">
              <Text color="red.500">⚠️ {error}</Text>
            </Alert>
          )}

          {/* Section 4: Two Column Layout for Simplified Criteria and Docs */}
          {criteriaResult && (
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <Card bg={cardBg} shadow="md" height="fit-content">
                  <CardBody>
                    <Heading size="md" color="green.600" mb={4}>
                      Simplified Clinical Criteria
                    </Heading>
                    <Box>
                      {formatText(criteriaResult["Simplified Clinical Criteria"])}
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card bg={cardBg} shadow="md" height="fit-content">
                  <CardBody>
                    <Heading size="md" color="purple.600" mb={4}>
                      Docs to Upload
                    </Heading>
                    <Box>
                      {formatText(criteriaResult["Docs To Upload"])}
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          )}

          {/* Section 5: Clinical Criteria */}
          {criteriaResult && (
            <Card bg={cardBg} shadow="md">
              <CardBody>
                <Heading size="md" color="orange.600" mb={4}>
                  Clinical Criteria
                </Heading>
                <Box>
                  {formatText(criteriaResult["Clinical Criteria"])}
                </Box>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BrowserPAAssistTool;