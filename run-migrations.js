const { exec } = require('child_process');
const path = require('path');
const { stdout, stderr } = require('process');

const migrationScriptPath = path.join(__dirname, 'database/migrations', 'createTables.js');

exec(`node ${migrationScriptPath}`, (err, stdout, stderr) => {
    if(err){
        console.error(`error executing script: ${err}`);
        return;
    }

    const messages = {
        Output:stdout,
        Errors:stderr
    }

    console.log(`messages: ${messages}`);
});