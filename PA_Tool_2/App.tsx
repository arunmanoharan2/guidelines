import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import PAAssistTool from './PAAssistTool';

function App() {
  return (
    <ChakraProvider>
      <PAAssistTool />
    </ChakraProvider>
  );
}

export default App;