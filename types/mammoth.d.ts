declare module 'mammoth' {
  interface MammothOptions {
    buffer?: Buffer;
    path?: string;
    arrayBuffer?: ArrayBuffer;
    styleMap?: string;
    includeDefaultStyleMap?: boolean;
    includeEmbeddedStyleMap?: boolean;
    convertImage?: (image: any) => Promise<any>;
    ignoreEmptyParagraphs?: boolean;
    idPrefix?: string;
  }

  interface MammothResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
      paragraph?: number;
    }>;
  }

  function extractRawText(options: MammothOptions): Promise<MammothResult>;
  function convertToHtml(options: MammothOptions): Promise<MammothResult>;
  function convertToMarkdown(options: MammothOptions): Promise<MammothResult>;

  export = {
    extractRawText,
    convertToHtml,
    convertToMarkdown
  };
} 