import React, { useState, useRef, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Tree from 'react-d3-tree';
import './TreeStyles.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const inputRef = useRef(null);
  const treeContainerRef = useRef(null);

  const theme = createTheme();

  useEffect(() => {
    const updateDimensions = () => {
      if (inputRef.current && treeContainerRef.current) {
        const width = inputRef.current.offsetWidth;
        setDimensions({ width, height: 500 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleJsonChange = (event) => {
    setJsonInput(event.target.value);
    setError(null);
  };

  const generateTree = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const tree = convertJsonToTree(jsonData);
      setTreeData(tree);
      setError(null);
    } catch (error) {
      setError('Invalid JSON input: ' + error.message);
      setTreeData(null);
    }
  };

  const convertJsonToTree = (json) => {
    if (typeof json !== 'object' || json === null) {
      return { name: JSON.stringify(json) };
    }

    const node = { name: 'root', children: [] };

    for (const [key, value] of Object.entries(json)) {
      if (typeof value === 'object' && value !== null) {
        node.children.push({ name: key, children: convertJsonToTree(value).children });
      } else {
        node.children.push({ name: key, attributes: { value: JSON.stringify(value) } });
      }
    }

    return node;
  };

  const loadSampleJson = () => {
    const sampleJson = {
      "library": {
        "name": "City Central Library",
        "BookSection": {
          "category": "Fiction",
          "BookList": {
            "BookEntry": {
              "ISBN": "9780061120084",
              "SortBy": "Author",
              "Title": "To Kill a Mockingbird",
              "Author": "Harper Lee",
              "PublicationYear": "1960",
              "BookInfo": {
                "summary": "A novel about racial injustice and the loss of innocence in the American South.",
                "RelatedGenres": ["Southern Gothic", "Bildungsroman"]
              },
              "Awards": "Pulitzer Prize"
            }
          }
        }
      }
    };
    setJsonInput(JSON.stringify(sampleJson, null, 2));
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #0077be, #00008b)',
          padding: 3
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            my: 4, 
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            padding: 3
          }}>
            <Typography variant="h4" component="h1" gutterBottom
              sx={{ 
                fontFamily: "Roboto"
              }}
            >
              JSON Tree
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={jsonInput}
              onChange={handleJsonChange}
              placeholder="Paste your JSON here"
              variant="outlined"
              sx={{ mb: 2, mt: 2 }}
              inputRef={inputRef}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" onClick={generateTree}>
                Generate Tree
              </Button>
              <Button variant="outlined" onClick={loadSampleJson}>
                Load Sample JSON
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {treeData && (
              <Box ref={treeContainerRef} sx={{ 
                height: '500px', 
                mt: 2, 
                border: '1px solid #ccc',
                backgroundColor: 'white',
                borderRadius: 1
              }}>
                <Tree
                  data={treeData}
                  orientation="vertical"
                  pathFunc="step"
                  translate={{ x: dimensions.width / 2, y: 50 }}
                  dimensions={dimensions}
                  nodeSize={{ x: 200, y: 50 }}
                  separation={{ siblings: 1, nonSiblings: 2 }}
                  rootNodeClassName="node__root"
                  branchNodeClassName="node__branch"
                  leafNodeClassName="node__leaf"
                />
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;