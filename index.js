#!/usr/bin/env node
var filehound = require('filehound');
var Nuget = require('nuget-runner');
var program = require('commander');
var fs = require('fs');

program
    .version('0.0.1')
    .option('-s, --solution <solutionName>', 'Name of solution file to update packages of', '')
    .option('-r, --repositoryAlias <alias>', 'Alias defined to simplify access to nuget repos', '')
    .option('-l, --list', 'List all aliases')
    .parse(process.argv);

var repositories = JSON.parse(fs.readFileSync(__dirname + '/repositories.json', 'utf8'));
if(program.list) {
    console.log('Aliases');
    console.log(repositories);
    return;
}

if(program.repositoryAlias === '') {
    console.log('You must specify a repository alias');
    return;
}

var files = createSearch().find();

files.then(function(files) {
  for(var i = 0; i < files.length; i++) {
      update(files[i]);
  }  
  return;
});

function createSearch() {
    var baseSearch = filehound.create().paths(process.cwd());

    var solution = program.solution;
    if(solution !== '') {
        baseSearch.match('*' + solution);
    } else {
        baseSearch.ext('sln')
    }
    return baseSearch;
}

function update(solution) {
    function getSources(alias) {
        var r = repositories.find(o => o.alias == alias);        
        if(r === undefined) {
            return null;
        }
        return r.url;
    }

    var nuget = Nuget({
        nugetPath: __dirname + './nuget.exe'
    });

    var repository = getSources(program.repositoryAlias);

    if(repository === null) {
        console.log('Repository with alias \'' + program.repositoryAlias + '\' was not found. Check your repositories.json file.');
        return;
    }

    console.log('Using \'' + repository + '\' as package source');

    nuget.restore({
        packages: solution,
        source: [repository]
    }).then(function() {
        nuget.update({
            packages: solution,
            self: false,
            fileConflictAction: 'Overwrite',
            verbosity: 'normal',
            source: [repository]
        })
    });
};