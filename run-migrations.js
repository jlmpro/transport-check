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
    if (stdout) {
        console.log(`Output: ${stdout}`);
    } else {
        console.error(`Errors: ${stderr}`);
    }

});