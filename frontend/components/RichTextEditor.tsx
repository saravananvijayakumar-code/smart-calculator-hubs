import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

export const RichTextEditor = ({ 
  value, 
  onChange, 
  height = 400, 
  placeholder = "Start writing..." 
}: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Load TinyMCE from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
    script.onload = () => {
      if (window.tinymce) {
        window.tinymce.init({
          selector: '#tinymce-editor',
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
          ],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image media table | code codesample | calculator | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }',
          placeholder: placeholder,
          image_upload_handler: async (blobInfo: any) => {
            return new Promise(async (resolve, reject) => {
              try {
                console.error('Image upload not implemented');
                reject('Image upload not implemented');
              } catch (error) {
                console.error('Image upload failed:', error);
                reject('Image upload failed');
              }
            });
          },
          setup: (editor: any) => {
            editorRef.current = editor;
            
            // Custom calculator button
            editor.ui.registry.addButton('calculator', {
              text: 'Calculator',
              tooltip: 'Insert Calculator',
              onAction: () => {
                editor.windowManager.open({
                  title: 'Insert Calculator',
                  body: {
                    type: 'panel',
                    items: [
                      {
                        type: 'selectbox',
                        name: 'calculator',
                        label: 'Calculator Type',
                        items: [
                          { text: 'Compound Interest Calculator', value: 'compound-interest' },
                          { text: 'Mortgage Calculator', value: 'mortgage' },
                          { text: 'Loan Calculator', value: 'loan' },
                          { text: 'Investment Calculator', value: 'investment' },
                          { text: 'Retirement Calculator', value: 'retirement' },
                          { text: 'BMI Calculator', value: 'bmi' },
                          { text: 'Percentage Calculator', value: 'percentage' },
                          { text: 'Currency Converter', value: 'currency' },
                          { text: 'Tip Calculator', value: 'tip' },
                        ]
                      }
                    ]
                  },
                  buttons: [
                    {
                      type: 'cancel',
                      text: 'Close'
                    },
                    {
                      type: 'submit',
                      text: 'Insert',
                      primary: true
                    }
                  ],
                  onSubmit: (api: any) => {
                    const data = api.getData();
                    const calculatorType = data.calculator;
                    
                    // Insert calculator placeholder
                    const calculatorHtml = `
                      <div class=\"embedded-calculator\" data-calculator=\"${calculatorType}\" style=\"border: 2px dashed #ccc; padding: 20px; margin: 20px 0; text-align: center; background: #f9f9f9;\">
                        <h3>📊 ${calculatorType.replace('-', ' ').replace(/\\b\\w/g, (l: string) => l.toUpperCase())} Calculator</h3>
                        <p style=\"color: #666; margin: 10px 0;\">This calculator will be rendered when the blog post is published.</p>
                        <small style=\"color: #999;\">Calculator Type: ${calculatorType}</small>
                      </div>
                    `;
                    
                    editor.insertContent(calculatorHtml);
                    api.close();
                  }
                });
              }
            });
            
            editor.on('change', () => {
              const content = editor.getContent();
              onChange(content);
            });
            
            editor.on('init', () => {
              if (value) {
                editor.setContent(value);
              }
            });
          },
        });
      }
    };
    document.head.appendChild(script);
    
    return () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <div>
      <textarea id="tinymce-editor" />
    </div>
  );
};

// Extend window to include tinymce
declare global {
  interface Window {
    tinymce: any;
  }
}