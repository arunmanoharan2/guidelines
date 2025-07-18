import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import BrowserPAAssistTool from './BrowserPAAssistTool';

function BrowserApp() {
  return (
    <ChakraProvider>
      <BrowserPAAssistTool />
    </ChakraProvider>
  );
}

export default BrowserApp;