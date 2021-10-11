import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
    id: string;
    content: string;
    type: 'code' | 'text';
}

export const createCellsRouter = (filename: string, dir: string) => {
    const router = express.Router();
    router.use(express.json());
    const fullPath = path.join(dir, filename);
    router.get('/cells', async (req, res) => {
        try {
            const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
            res.send(JSON.parse(result));
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                const defaultFilepath = path.join(process.cwd(), 'jpad.js');
                const defaultCells = await fs.readFile(defaultFilepath, { encoding: 'utf-8' });
                await fs.writeFile(fullPath, defaultCells, 'utf-8');
                res.send([]);
            } else {
                throw error;
            }
        }
    });

    router.post('/cells', async (req, res) => {
        const { cells }: { cells: Cell[] } = req.body;
        await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');
        res.send({ status: 'ok' });
    });

    return router;
};
