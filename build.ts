import Bun, { $ } from 'bun';
import { Project, SyntaxKind } from 'ts-morph';

// First step to bundle all the files
const foo = await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './out',
});

// Ts-morph only understands TypeScript files,
// so we need to convert the output file to a TypeScript file
const oldFile = Bun.file(foo.outputs[0].path);
await Bun.write('out/index.ts', oldFile);

// Start Ts-morph
const project = new Project();
const file = project.addSourceFileAtPath('out/index.ts');

/**
 * The function hoistClassUptoFirstUsage moves a target class to the first usage within its parent
 * class.
 * @param {string} targetClassName - The `targetClassName` parameter is a string that represents the
 * name of the class that you want to hoist up to its first usage.
 * @returns nothing (undefined) if any of the following conditions are met:
 * - The target class with the specified name does not exist in the file.
 * - There are no references to the target class in the file.
 * - The target class text is empty or undefined.
 * - The first usage of the target class does not have a parent class declaration.
 * - The parent class declaration does not have a name
 */
function hoistClassUptoFirstUsage(targetClassName: string) {
  const targetClass = file.getClass(targetClassName);
  if (!targetClass) return;

  const targetClassText = targetClass.getText();
  const references = targetClass.findReferencesAsNodes();

  if (references.length === 0 || !targetClassText) return;

  const firstUsage = references[0];
  const parentClassDeclaration = firstUsage.getFirstAncestorByKind(
    SyntaxKind.ClassDeclaration,
  );

  if (!parentClassDeclaration) return;

  const parentClassName = parentClassDeclaration.getName();
  if (!parentClassName) return;

  const parentClass = file.getClass(parentClassName);
  if (!parentClass) return;

  const parentClassText = parentClass.getText();
  parentClass.replaceWithText(`${targetClassText}\n${parentClassText}`);

  targetClass.remove();
  file.saveSync();
}

hoistClassUptoFirstUsage('BasePromptTemplate');
hoistClassUptoFirstUsage('BaseChain');

const result = await Bun.build({
  entrypoints: ['./out/index.ts', './src/popup.ts'],
  outdir: './dist',
  naming: '[name].[ext]',
});

await $`rm -rf out`;
