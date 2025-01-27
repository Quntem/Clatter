import EditorJS from '@editorjs/editorjs';
import EditorjsList from '@editorjs/list';
import Header from '@editorjs/header'

window.LaunchDocEditor = function() {
    try {
        window.editor.destroy
    } catch {
    
    }
    
    window.editor = new EditorJS({
        holder: "editorjs",
        tools: {
            list: {
                class: EditorjsList,
                inlineToolbar: true,
                config: {
                    defaultStyle: 'unordered'
                },
            },
            header: Header,
        },
    });
}