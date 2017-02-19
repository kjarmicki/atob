// not using babel here because babel-cli doesn't support es6 modules anyway
const fs = require('fs');
const xml2js = require('xml2js');
const pkg = require('../../../package.json');
const CONFIG_PATH = `${__dirname}/../../../dist/cordova/config.xml`;
const config = fs.readFileSync(CONFIG_PATH);
const preferences = require('./preferences');

const pick = ['version', 'description', 'author'];
const parser = new xml2js.Parser();
const builder = new xml2js.Builder();

// pick desired keys from package.json
const picked = Object.getOwnPropertyNames(pkg)
    .filter(name => pick.includes(name))
    .reduce((obj, current) => {
        obj[current] = pkg[current];
        return obj;
    }, {});

// parse xml config file
parser.parseString(config, (err, xml) => {
    // decorate it with stuff from package.json and preferences.js
    xml.widget.$.version = picked.version;
    xml.widget.description = picked.description;
    xml.widget.preference = Object.getOwnPropertyNames(preferences).map(preferenceName => {
        return {
            $: {
                name: preferenceName,
                value: preferences[preferenceName]
            }
        }
    });
    xml.widget.author[0]._ = picked.author.name;
    xml.widget.author[0].$.email = picked.author.email;
    xml.widget.author[0].$.href = picked.author.url;

    // rewrite the file
    const decoratedConfig = builder.buildObject(xml);
    fs.writeFileSync(CONFIG_PATH, decoratedConfig);
});