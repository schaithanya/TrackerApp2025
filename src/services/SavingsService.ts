import { SAVING_TYPES, SavingType } from '../constants/savingTypes';
import { FileService } from './FileService';

const fileService = new FileService();

export interface SavingsData {
    savingName: string;
    savingType: SavingType;
    amount: number;
    maturityAmount: number;
    startDate: string | string[];
    endDate: string | string[];
    comments: string;
    file: File | null;
}

const SAVINGS_FILE = 'savings.json';

export const saveSavingsData = async (data: SavingsData) => {
    try {
        // Read existing data
        let existingData: SavingsData[] = [];
        try {
            const fileContent = await fileService.readFile(SAVINGS_FILE);
            existingData = JSON.parse(fileContent);
        } catch (error) {
            // File doesn't exist yet, that's okay
        }

        // Add new data
        existingData.push(data);

        // Save file
        await fileService.writeFile(SAVINGS_FILE, JSON.stringify(existingData));

        // Save file attachment if exists
        if (data.file) {
            const filePath = `savings_files/${Date.now()}_${data.file.name}`;
            const fileData = await readFileAsBase64(data.file);
            await fileService.writeFile(filePath, fileData);
        }
    } catch (error) {
        console.error('Error saving savings data:', error);
        throw error;
    }
};

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const getSavingsData = async (): Promise<SavingsData[]> => {
    try {
        const fileContent = await fileService.readFile(SAVINGS_FILE);
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
};
