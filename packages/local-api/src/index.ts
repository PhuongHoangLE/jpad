import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createCellsRouter } from './routes/cells';

export const serve = (port: number, filename: string, dir: string, useProxy: boolean) => {
    const app = express();

    app.use(createCellsRouter(filename, dir));

    if (useProxy) {
        app.use(
            createProxyMiddleware({
                target: 'http://localhost:3000',
                ws: true, // websocket
                logLevel: 'silent',
            })
        );
    } else {
        const clientPath = require.resolve('@jpad/local-client/build/index.html');
        const clientDir = path.dirname(clientPath);
        app.use(express.static(clientDir));
    }

    return new Promise<void>((resolve, reject) => {
        app.listen(port, resolve).on('error', reject);
    });
};
