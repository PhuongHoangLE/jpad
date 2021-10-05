import Editor from '@monaco-editor/react';
import { FC } from 'react';

interface CodeEditorProps {
    initialValue: string;
    onChange(value: string | undefined): void;
}

const CodeEditor: FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    return (
        <Editor
            onChange={onChange}
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
    );
};

export default CodeEditor;
