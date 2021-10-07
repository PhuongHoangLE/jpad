import './preview.css';
import { FC, useEffect, useRef } from 'react';

interface PreviewProps {
    code: string;
    error: string;
}

const html = `
<html>
    <head>
        <style>
            html {
                background-color: #1e1e1e;
                color: #cecece;
            }
        </style>
    </head>
    <body>
        <div id="root"></div>
        <script>
            const handleError = (error) => {
                const root = document.getElementById('root');
                root.innerHTML = '<div>' + error + '</div>';
                console.error(error);
            };
            window.addEventListener('error', ({ error }) => {
                handleError(error);
            });
            window.addEventListener(
                'message',
                ({ data }) => {
                    try {
                        eval(data);
                    } catch (error) {
                        handleError(error);
                    }
                },
                false
            );
        </script>
    </body>
</html>
`;

const Preview: FC<PreviewProps> = ({ code, error }) => {
    const iframe = useRef<any>();

    useEffect(() => {
        iframe.current.srcdoc = html;
        setTimeout(() => {
            iframe.current.contentWindow.postMessage(code, '*');
        }, 69);
    }, [code]);

    return (
        <div className="preview-wrapper">
            <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts" title="sandbox" />
            {error && <div className="preview-error">{error}</div>}
        </div>
    );
};

export default Preview;
