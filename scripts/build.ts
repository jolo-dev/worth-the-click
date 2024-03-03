import Bun, { $ } from 'bun';
import { Project, SyntaxKind } from 'ts-morph';

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
  console.log(`Hoisting ${targetClassName} to its first usage`);

  // Start Ts-morph
  const project = new Project();
  const file = project.addSourceFileAtPath('out/index.ts');
  const targetClass = file.getClass(targetClassName);
  if (!targetClass) return;

  const targetClassText = targetClass.getText();
  const references = targetClass.findReferencesAsNodes();

  if (references.length === 0 || !targetClassText) return;

  const firstUsage = references[0];
  const firstReferenceUsage = firstUsage.getFirstAncestorByKind(
    SyntaxKind.ClassDeclaration,
  );

  if (!firstReferenceUsage) return;

  const firstReferenceUsageClassName = firstReferenceUsage.getName();
  if (!firstReferenceUsageClassName) return;

  const firstReferenceClass = file.getClass(firstReferenceUsageClassName);
  if (!firstReferenceClass) return;

  const firstReferenceClassDeclaration = firstReferenceClass.getText();
  firstReferenceClass.replaceWithText(
    `${targetClassText}\n${firstReferenceClassDeclaration}`,
  );

  targetClass.remove();
  file.saveSync();
}

export async function build() {
  console.log('Building');

  await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: './out',
    naming: '[name].ts',
  });

  hoistClassUptoFirstUsage('BasePromptTemplate');
  hoistClassUptoFirstUsage('BaseChain');

  const result = await Bun.file('out/index.ts').text();
  await Bun.write('dist/index.js', result);

  await Bun.build({
    entrypoints: ['./src/popup.ts'],
    outdir: './dist',
    naming: '[name].[ext]',
  });

  const remove = await $`rm -rf out`;
  console.log(remove.exitCode === 0 ? 'Bundled sucessfully' : remove.stderr);
}

await build();
// console.log(`Listening on ${server.url}`);
