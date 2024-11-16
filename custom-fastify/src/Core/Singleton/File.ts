import * as path from "path";
import * as fs from "fs";
import Random from "./Random";

class File {
    name(dir: string): string {
        const basename = path.basename(dir);
        return basename.substring(0, basename.lastIndexOf('.'));
    }

    ext(dir: string): string {
        return path.extname(dir).substring(1);
    }

    mkdirSync(dir: string, recursive: boolean = true): string | undefined {
        return fs.mkdirSync(dir, {recursive});
    }

    async mkdir(dir: string, recursive: boolean = true): Promise<string | undefined> {
        return await fs.promises.mkdir(dir, {recursive});
    }

    mkdirForFileSync(dir: string): string | undefined {
        return this.mkdirSync(path.dirname(dir));
    }

    async mkdirForFile(dir: string): Promise<string | undefined> {
        return await this.mkdir(path.dirname(dir));
    }

    removeSync(dir: string): void {
        return fs.unlinkSync(dir);
    }

    remove(dir: string): Promise<void> {
        return fs.promises.unlink(dir);
    }

    moveFileSync(src: string, dst: string): void {
        this.mkdirForFileSync(dst);
        return fs.renameSync(src, dst);
    }

    async moveFile(src: string, dst: string): Promise<void> {
        return await this.mkdirForFile(dst).then((data) => {
            if (data === undefined)
                throw new Error(`Could not create directory(${dst})`);
            return fs.promises.rename(src, dst);
        })
    }

    gatherFilesSync(dir: string, callback: (name: string, ext: string, newDir: string) => void, filterExtensions: string[] | Function = []): void {
        fs.readdirSync(dir).forEach((file) => {
            const newDir = path.join(dir, file);

            if (fs.statSync(newDir).isDirectory())
                this.gatherFilesSync(newDir, callback, filterExtensions);
            else {
                const ext = this.ext(newDir);
                const name = this.name(newDir);
                const fullname = path.basename(newDir).split('.');
                if (Array.isArray(filterExtensions)) {
                    if (!filterExtensions.length) {
                        callback(name, ext, newDir);
                    } else if (filterExtensions.length <= fullname.length) {
                        let lastIndexFilter = filterExtensions.length - 1, lastIndexFullname = fullname.length - 1;
                        let isValid = true;
                        while (lastIndexFilter >= 0) {
                            if (fullname[lastIndexFullname].length && filterExtensions[lastIndexFilter] !== fullname[lastIndexFullname]) {
                                isValid = false;
                                break;
                            }
                            lastIndexFullname--;
                            lastIndexFilter--;
                        }
                        if (isValid)
                            callback(fullname.slice(0, fullname.length - filterExtensions.length).join('.'), fullname.slice(fullname.length - filterExtensions.length).join('.'), newDir);
                    }
                } else if (filterExtensions(name, ext, newDir))
                    callback(name, ext, newDir);
            }
        })
    }

    async gatherFiles(dir: string, callback: (name: string, ext: string, newDir: string) => void, filterExtensions: string[] | Function = []): Promise<void> {
        const dirs = await fs.promises.readdir(dir);
        for await (const file of dirs) {
            const newDir = path.join(dir, file);
            if (fs.statSync(newDir).isDirectory())
                await this.gatherFiles(newDir, callback, filterExtensions);
            else {
                const ext = this.ext(newDir);
                const name = this.name(newDir);
                const fullname = path.basename(newDir).split('.');
                if (Array.isArray(filterExtensions)) {
                    if (!filterExtensions.length) {
                        await callback(name, ext, newDir);
                    } else if (filterExtensions.length <= fullname.length) {
                        let lastIndexFilter = filterExtensions.length - 1, lastIndexFullname = fullname.length - 1;
                        let isValid = true;
                        while (lastIndexFilter >= 0) {
                            if (fullname[lastIndexFullname].length && filterExtensions[lastIndexFilter] !== fullname[lastIndexFullname]) {
                                isValid = false;
                                break;
                            }
                            lastIndexFullname--;
                            lastIndexFilter--;
                        }
                        if (isValid)
                            await callback(fullname.slice(0, fullname.length - filterExtensions.length).join('.'), fullname.slice(fullname.length - filterExtensions.length).join('.'), newDir);
                    }
                } else if (filterExtensions(name, ext, newDir))
                    await callback(name, ext, newDir);
            }
        }
    }

    randomName(ext: string, size: number = 64) {
        return `${Random.nonSecure(size)}.${ext}`
    }

    writeSync(path : string,data : any){
        return fs.writeFileSync(path,`${data}`);
    }

    async write(path : string,data : any){
        return await fs.promises.writeFile(path,`${data}`);
    }
}

export default new File();