import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export class FileService {
    async writeFile(path: string, data: string) {
        await Filesystem.writeFile({
            path: path,
            data: data,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
    }

    async readFile(path: string) {
        const result = await Filesystem.readFile({
            path: path,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        return result.data;
    }
}
