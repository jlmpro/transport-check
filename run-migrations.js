const { exec } = require('child_process');
const { error } = require('console');
const path = require('path');

const migrationScriptPath = path.join(__dirname, 'database/migrations', 'createTables.js');

exec(`node ${migrationScriptPath}`, (err, stdout, stderr) => {
    if (err) {
        console.error(`Error execution script: ${err}`);
        return
    }

    /*const messages = {
        Output: stdout,
        Errors: stderr
    }*/

    console.log(`Output: ${stdout}`);
    console.error(`Errors: ${stderr}`);
});