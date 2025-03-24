const fs = require('fs');
const path = require('path');
const glob = require('glob');

function extractComponentStructure() {
  const componentsDir = path.join(process.cwd(), 'app/components');
  const outputDir = path.join(process.cwd(), '/scripts/component-docs');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Component structure file
  const componentStructure = {
    components: {}
  };

  // Collect component details
  const componentFiles = glob.sync(`${componentsDir}/**/*.{js,tsx,ts}`);

  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const componentName = path.basename(file, path.extname(file));
    
    // Basic structure extraction
    componentStructure.components[componentName] = {
      fileName: path.basename(file),
      path: path.relative(process.cwd(), file),
      props: extractProps(content),
      description: extractDescription(content)
    };
  });

  // Write component structure
  fs.writeFileSync(
    path.join(outputDir, 'component-structure.json'), 
    JSON.stringify(componentStructure, null, 2)
  );
}

function extractProps(content) {
  // Simple prop extraction (can be enhanced)
  const propMatches = content.match(/interface\s+(\w+)Props\s*{([^}]+)}/);
  return propMatches ? propMatches[2].trim() : 'No props defined';
}

function extractDescription(content) {
  // Extract JSDoc or comment description
  const descMatch = content.match(/\/\*\*\s*(.*?)\s*\*\//s);
  return descMatch ? descMatch[1].trim() : 'No description';
}

function collectComponentSources() {
  const componentsDir = path.join(process.cwd(), 'app/components');
  const outputDir = path.join(process.cwd(), '/scripts/component-docs');

  // Collect all component source code
  const componentSources = {};
  const componentFiles = glob.sync(`${componentsDir}/**/*.{js,tsx,ts}`);

  componentFiles.forEach(file => {
    const componentName = path.basename(file, path.extname(file));
    componentSources[componentName] = fs.readFileSync(file, 'utf8');
  });

  // Write component sources
  fs.writeFileSync(
    path.join(outputDir, 'component-sources.json'), 
    JSON.stringify(componentSources, null, 2)
  );
}

// Run both functions
extractComponentStructure();
collectComponentSources();