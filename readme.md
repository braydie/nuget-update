# nuget-update

For quickly updating nuget packages to their latest version. Will find all solutions recurisvely from the current working directory and update all nuget packages based on a supplied nuget repository alias.

## Usage

Once installed, you can modify the repositories.json file from wherever node has installed the package. Here you can specify aliases to use on the command line.

```
[
    {
        "alias" : "default",
        "url" : "http://api.nuget.org/v3/index.json"
    },
    {
        "alias": "myrepo",
        "url": "http://mynugetrepo/nuget"
    }
]
```

In a directory that has some .sln files - doesn't have to be top level:
```
nu --repositoryAlias myrepo
```

### Examples

```
nu -r myrepo
nu -s MySolution.sln -r default
nu -l
```

### Options

```
-V, --version                  output the version number
-s, --solution <solutionName>  Name of solution file to update packages of
-r, --repositoryAlias <alias>  Alias defined to simplify access to nuget repos
-l, --list                     List all aliases
-h, --help                     output usage information
```