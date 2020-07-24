// Ecrire une application de notes en Node.js.   
// Les notes seront stockées dans un fichier datas/notes.json

// node app.js
// - `list` = Affiche les titres de toutes les notes
// - `add --title="Ma note" --body="Contenu de ma note"` = Ajoute une note. Le titre doit être unique et les deux champs sont requis
// - `remove --title="Ma note"`= Supprime la note avec le titre précisé
// - `read --title="Ma note"` = Affiche le title/body de la note spécifiée

const fs = require('fs');
const yargs = require('yargs');
const chalk = require('chalk');

function loadDatas(path) {
    let data = fs.readFileSync(path);
    return JSON.parse(data.toString());
}

yargs
.command({
    command: 'add',
    describe: 'Add note in file datas/notes.json',
    builder: {
        title: {
            describe: "note's title",
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: "note's content",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => { 
        let datas = loadDatas('datas/notes.json');
        if (datas.some(data => data.title === argv.title)){
            console.log("Title already exist :(");
        }
        else {
            let newNote = {"title": argv.title, "body": argv.body};
            datas.push(newNote);
            fs.writeFile('./datas/notes.json', JSON.stringify(datas) , (err) => {
                if(err) throw err;
            });
            console.log(chalk.blue("Add note in file."));
        }
    }
})
.command({
    command: 'list',
    describe: 'List note\'s title in file datas/notes.json',
    handler: () => { 
        let datas = loadDatas('datas/notes.json');
        console.log(chalk.underline.blue("Notes:"));
        datas.forEach(data => {
            console.log(data.title);
        });
    }
})
.command({
    command: 'remove',
    describe: 'remove note from title',
    builder: {
        title: {
            describe: "note's title you wish to remove",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => { 
        let datas = loadDatas('datas/notes.json');
        let newDatas = datas.filter(data => data.title != argv.title);
        fs.writeFile('./datas/notes.json', JSON.stringify(newDatas) , (err) => {
            if(err) throw err;
        });
        console.log(chalk.blue("Done !"));
    }
})
.command({
    command: 'read',
    describe: 'Display a note from title',
    builder: {
        title: {
            describe: "note's title you wish to remove",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => { 
        let datas = loadDatas('datas/notes.json');
        let note = datas.filter(data => data.title === argv.title);
        console.log(`Title: ${note[0].title}`);
        console.log(`Content: ${note[0].body}`);
    }
}).argv

