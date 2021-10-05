import './preview.css';
import { FC, useEffect, useRef } from 'react';

interface PreviewProps {
    code: string;
}

const html = `
<html>
    <head>
        <style>html { background-color: #1e1e1e; color: #cecece }</style>
    </head>
    <body>
        <div id="root"></div>
        <script>
            window.addEventListener(
                'message',
                (event) => {
                    try {
                        eval(event.data);
                    } catch (error) {
                        const root = document.getElementById('root');
                        root.innerHTML = '<div>' + '<h4 style="color: red">Runtime Error</h4>' + error + '</div>';
                        console.error(error);
                    }
                },
                false
            );
        </script>
    </body>
</html>
`;

const Preview: FC<PreviewProps> = ({ code }) => {
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
        </div>
    );
};

export default Preview;
