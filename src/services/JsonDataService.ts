import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export class JSONDataService {
    async writeJSON(path: string, data: any) {
        await Filesystem.writeFile({
            path: path,
            data: JSON.stringify(data),
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
    }

    async readJSON(path: string) {
        const result = await Filesystem.readFile({
            path: path,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
        });
        return JSON.parse(result.data);
    }

    async updateJSON(path: string, data: any) {
        await this.writeJSON(path, data);
    }

    async deleteJSON(path: string) {
        await Filesystem.deleteFile({
            path: path,
            directory: Directory.Documents,
        });
    }
}
