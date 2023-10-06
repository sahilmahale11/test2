import Editor from '@monaco-editor/react';
import { StyledBox } from './EditorStyles';
const EditorComponent = ({ id, language, code }: any) => {
    return (
        <StyledBox>
            <Editor
                key={id}
                language={language}
                theme='light'
                value={code}
                options={{
                    readOnly: true,
                    lineNumbers: 'on', // Add this option to enable line numbers
                }}
            />
        </StyledBox>
    );
};

export default EditorComponent;
