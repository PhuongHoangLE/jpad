import './code-editor.css';
// import './syntax.css';
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';
import { FC, useRef } from 'react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>();
    const editor = editorRef.current;
    const onFormatClick = () => {
        const unformatted = editor?.getModel()?.getValue();
        if (!unformatted) return;
        const formatted = prettier
            .format(unformatted, {
                parser: 'babel',
                plugins: [parser],
                useTabs: false,
                semi: true,
                singleQuote: true,
            })
            .replace(/\n$/, '');
        editor?.setValue(formatted);
    };
    const onEditorChange = (value: string | undefined): void => {
        onChange(value || '');
        if (!editor) return;
        const highlighter = new Highlighter(
            monaco,
            (code: string) => parse(code, { sourceType: 'module', plugins: ['jsx'] }),
            traverse,
            editor
        );
        highlighter.highLightOnDidChangeModelContent(
            100,
            () => {},
            () => {},
            undefined,
            () => {}
        );
    };
    return (
        <div className="editor-wrapper">
            <button onClick={onFormatClick} className="button button-format is-primary is-small">
                Prettify
            </button>
            <Editor
                onChange={onEditorChange}
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
        </div>
    );
};

export default CodeEditor;
