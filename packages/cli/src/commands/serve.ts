import { Command } from 'commander';
import { serve } from 'local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
    .command('serve [filename]')
    .description('Open a file for editing')
    .option('-p, --port <number>', 'Port to run server on', '4005')
    .action(async (filename = 'notebook.js', options: { port: string }) => {
        try {
            const portNumber = parseInt(options.port);
            const filenameOnly = path.basename(filename);
            const dir = path.join(process.cwd(), path.dirname(filename));
            const useProxy = !isProduction;
            await serve(portNumber, filenameOnly, dir, useProxy);
            console.info(`'${filename}' is now served at http://localhost:${options.port}`);
        } catch (error: any) {
            handleError(error);
        }
    });

function handleError(error: any) {
    const message = error.code === 'EADDRINUSE' ? 'Port is in use. Please try a different one.' : error.message;
    console.error(message);
    process.exit(1);
}
