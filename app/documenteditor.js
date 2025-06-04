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
        onChange: async function() {
            window.editor.save().then((outputData) => {
                var req = fetch("/api/document/" + currentdocumentid + "/content", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        accept: "application/json",
                    },
                    body: JSON.stringify({
                        content: outputData
                    })
                })
                req.then(res => {
                    console.log(res)
                })
              }).catch((error) => {
                console.log('Saving failed: ', error)
              });
        },
        onReady: async function() {
            var req = await fetch("/api/document/" + currentdocumentid + "/content")
            var content = await req.json()
            window.editor.render(content.content)
            console.log(content)
            if(window.location.href.includes("client")) {
                $("#mainarea-header-title").text(content.name)
            } else {

            }
        },
    });
}