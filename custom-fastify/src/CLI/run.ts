import {providers} from "./providers";

async function run(args: string[]) {
    const command = args[0];
    console.log('running ', command);

    if (command in providers) { // @ts-ignore
        await (new providers[command]).handle(args.slice(1));
    } else
        console.log('command not found');
}

console.log('From command.');
const args = process.argv.slice(2);
run(args);