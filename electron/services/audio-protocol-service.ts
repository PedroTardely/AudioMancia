import { net, protocol } from 'electron';
import path from 'node:path';
import { realpath } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import {
    getAudioLibraryBasePath,
    readLibraryMetadata
} from './audio-library-service.js';

type AudioProtocolRequest = Request & {
    initiatorOrigin?: string | null;
}

export const registerAudioProtocol = () => {
    protocol.handle('rpg-audio', async (request) => {
        try {

            const audioRequest = request as AudioProtocolRequest;

            const allowedOrigin = 'http://localhost:5173';

             if (
                audioRequest.initiatorOrigin &&
                audioRequest.initiatorOrigin !== allowedOrigin
            ) {
                return new Response('Forbiden', {
                    status: 403
                });
            }


           
            const url = new URL(request.url);

            if (url.hostname !== 'asset') {
                return new Response('Invalid resourse' , {
                    status: 400
                });
            }

            const assetId = decodeURIComponent(
                url.pathname.slice(1)
            );

            const library = readLibraryMetadata();

            const asset = library.assets.find(
                asset => asset.id === assetId
                )

            if (!asset) {
                return new Response('Asset not found', {
                    status: 404
                });
            }

            const basePath = await realpath(
                getAudioLibraryBasePath()
            );

            const filePath = await realpath(
                path.resolve(basePath, asset.relativePath)
            );

            const relative = path.relative(basePath, filePath);

            if (
                relative === '..' ||
                relative.startsWith('..' + path.sep) ||
                path.isAbsolute(relative)
            ) {
                return new Response('Access denied', {
                    status: 403
                });
            }

            const response = await net.fetch(
                pathToFileURL(filePath).toString()
            );

            const headers = new Headers(response.headers);

            console.log('AudioAsset encontrado:', asset.name);
            console.log('Caminho relativo:', asset.relativePath);
            console.log('Caminho completo:', filePath);

            headers.set(
                'Access-Control-Allow-Origin',
                'http://localhost:5173'
            );
            
            return new Response(response.body, {
                status: response.status,
                headers
            });

        } catch (error) {
            console.error('Audio protocol error:', error);

            return new Response('Audio unavaiable' , {
                status: 404
            });
        }
    });
};