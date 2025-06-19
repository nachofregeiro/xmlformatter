export interface FormatResult {
  formatted: string;
  isValid: boolean;
  error?: string;
}

export function formatXML(xml: string, indent: number = 2): FormatResult {
  if (!xml.trim()) {
    return { formatted: '', isValid: true };
  }

  try {
    // Parse XML to validate
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      return {
        formatted: xml,
        isValid: false,
        error: parserError.textContent || 'Invalid XML syntax'
      };
    }

    // Format the XML
    const formatted = formatXMLString(xml, indent);
    return { formatted, isValid: true };
  } catch (error) {
    return {
      formatted: xml,
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid XML'
    };
  }
}

export function minifyXML(xml: string): FormatResult {
  if (!xml.trim()) {
    return { formatted: '', isValid: true };
  }

  try {
    // Parse XML to validate
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      return {
        formatted: xml,
        isValid: false,
        error: parserError.textContent || 'Invalid XML syntax'
      };
    }

    // Minify by removing unnecessary whitespace
    const minified = xml
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();

    return { formatted: minified, isValid: true };
  } catch (error) {
    return {
      formatted: xml,
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid XML'
    };
  }
}

function formatXMLString(xml: string, indent: number): string {
  const PADDING = ' '.repeat(indent);
  const reg = /(>)(<)(\/*)/g;
  let formatted = xml.replace(reg, '$1\r\n$2$3');

  let pad = 0;
  return formatted.split('\r\n').map((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }

    const padding = PADDING.repeat(pad);
    pad += indent;

    return padding + node;
  }).join('\r\n');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}