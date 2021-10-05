import 'bulmaswatch/superhero/bulmaswatch.min.css';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Editor from '@monaco-editor/react';
import { FC, useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string | undefined): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>();
    const editor = editorRef.current;
    const onFormatClick = () => {
        const unformatted = editor?.getModel()?.getValue();
        if (!unformatted) return;
        const formatted = prettier.format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true,
        });
        editor?.setValue(formatted);
    };
    return (
        <>
            <button onClick={onFormatClick} className="button button-format is-primary is-small">
                Format
            </button>
            <Editor
                onChange={onChange}
                onMount={(editor) => (editorRef.current = editor)}
                value={initialValue}
                height="550px"
                language="javascript"
                theme="vs-dark"
                options={{
                    wordWrap: 'on',
                    minimap: { enabled: false },
                    showUnused: false,
                    folding: false,
                    lineNumbersMinChars: 3,
                    fontSize: 16,
                    scrollBeyondLastLine: true,
                    automaticLayout: true,
                    tabSize: 2,
                }}
            />
        </>
    );
};

export default CodeEditor;
