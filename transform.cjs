const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

function replaceWindowLocationWithNavigate(ast) {
  traverse(ast, {
    AssignmentExpression(path) {
      if (
        t.isMemberExpression(path.node.left) &&
        t.isIdentifier(path.node.left.object, { name: 'window' }) &&
        t.isIdentifier(path.node.left.property, { name: 'location' }) &&
        t.isMemberExpression(path.node.left.property) &&
        t.isIdentifier(path.node.left.property.property, { name: 'href' })
      ) {
        const argument = path.node.right;

        // Handle string literals and template literals
        if (t.isStringLiteral(argument) || t.isTemplateLiteral(argument)) {
          path.replaceWith(
            t.callExpression(t.identifier('navigate'), [argument])
          );
        }
      }
    },
    MemberExpression(path) {
      if (
        t.isIdentifier(path.node.object, { name: 'window' }) &&
        t.isIdentifier(path.node.property, { name: 'location' })
      ) {
        const parent = path.parentPath;
        if (parent.isMemberExpression() && t.isIdentifier(parent.node.property, { name: 'href' })) {
          const grandParent = parent.parentPath;
          if (grandParent.isAssignmentExpression()) {
            const argument = grandParent.node.right;
            if (t.isStringLiteral(argument) || t.isTemplateLiteral(argument)) {
              grandParent.replaceWith(
                t.callExpression(t.identifier('navigate'), [argument])
              );
            }
          }
        }
      }
    }
  });
}

function processFile(inputFile, outputFile) {
  // Read the input file
  const code = fs.readFileSync(inputFile, 'utf8');

  // Parse the code into an AST
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });

  // Apply the transformation
  replaceWindowLocationWithNavigate(ast);

  // Generate the new code
  const output = generate(ast, {}, code);

  // Write the transformed code to the output file
  fs.writeFileSync(outputFile, output.code);

  console.log(`Transformed ${inputFile} and saved to ${outputFile}`);
}

// Check if input and output file paths are provided
if (process.argv.length < 3) {
  console.log('Usage: node script.js <input_file> <output_file>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[2];

processFile(inputFile, outputFile);