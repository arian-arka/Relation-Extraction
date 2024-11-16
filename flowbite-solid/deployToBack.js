const fs = require('fs');
const path = require('path');
const { execSync } = require("child_process");

const base = `./../../custom-fastify`

function emptyBack(){
    execSync(`rm -r ${base}/public`)
    execSync(`cd ${base} && mkdir public`)
}
function build(base ){
    fs.writeFileSync(`./src/env.ts`,`export default {base : '${base ?? 'http://127.0.0.1:3000'}'}`,{encoding:'utf8',flag:'w'})
    execSync(`npm run build`);
}

function getNames(){
    const assetsPath =`./dist/assets`;

    let csss = [];
    let scripts = [];

    function nameOfFile(dir) {
        const basename = path.basename(dir);
        return basename.substring(0, basename.lastIndexOf('.'));
    }
    fs.readdirSync(assetsPath).forEach((file) => {
        const newDir = path.join(assetsPath, file);
        if (!fs.statSync(newDir).isDirectory()){
            const ext = path.extname(newDir).substring(1);
            const name = path.extname(newDir).substring(1);
            if(ext === 'js')
                scripts.push(nameOfFile(newDir));
            else if(ext === 'css')
                csss.push(nameOfFile(newDir));
        }
    });
    return {csss,scripts};
}

const makeSchema = (scripts,csss) => {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title></title>
    `
        +scripts.map((script) => `<script type="module" crossorigin src="/assets/${script}.js"></script>`).join('\n')+
        `

`
        +csss.map((css) => `<link rel="stylesheet" href="/assets/${css}.css">`).join('\n')+
        `
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
  </body>
</html>
    `;
}

const makeIndexFile = (data) =>  {
    const backPagePath = path.resolve(__dirname,`${base}/public/index.html`);
    fs.writeFileSync(backPagePath,`${data}`);
}

const copyAssets = () => {
    execSync(`cp -r ./dist/assets ${base}/public/assets`)
}

function run(){
    emptyBack();
    build(process.argv[2]);
    const names = getNames();
    console.log(names);
    const indexFile = makeSchema(names.scripts,names.csss);
    makeIndexFile(indexFile);
    copyAssets();
}

run();

