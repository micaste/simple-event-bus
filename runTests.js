/**
 * This file runs all the files ending with `.test.js`, in its directory.
 * For a more robust implementation and better reporting, we should
 * use Jest.
 */

const fs = require('fs');

const testFilesRegexp = /.\.test\.js$/;

fs.readdir('.', (err, files) => {
  // Gather all the files to test in the current directory.
  const filesToTest = files.filter(fileName => testFilesRegexp.test(fileName));

  // Require each file. Requiring them should execute the tests. When
  // a test fails in a file, its execution stops and the process will fail.
  // But we still run all the files.
  let hasAtLeastOneTestFailing = false;
  filesToTest.forEach(fileName => {
    try {
      console.log(`Testing ${fileName}`);
      // To debug a test, one can use "Pause on caught exceptions" so that
      // they can see where the error is thrown.
      require(`./${fileName}`);
    } catch (e) {
      hasAtLeastOneTestFailing = true;
      console.error(`\u274C Some tests have failed in the file ${fileName}:`, e.message);
    }
  });
  if (hasAtLeastOneTestFailing) {
    process.exit(1);
  } else {
    console.log('\u2714 All tests passed successfully');
    process.exit(0);
  }
});
