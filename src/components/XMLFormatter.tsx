import React, { useState, useCallback, useRef } from 'react';
import { Copy, Trash2, Code, Minimize, CheckCircle, AlertCircle, FileText, Upload, Download } from 'lucide-react';
import { formatXML, minifyXML, copyToClipboard, FormatResult } from '../utils/xmlFormatter';

const XMLFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormat = useCallback(() => {
    const result: FormatResult = formatXML(input);
    setOutput(result.formatted);
    setIsValid(result.isValid);
    setError(result.error || null);
  }, [input]);

  const handleMinify = useCallback(() => {
    const result: FormatResult = minifyXML(input);
    setOutput(result.formatted);
    setIsValid(result.isValid);
    setError(result.error || null);
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
    setIsValid(true);
  }, []);

  const handleCopyInput = useCallback(async () => {
    if (input) {
      try {
        await copyToClipboard(input);
        setCopiedInput(true);
        setTimeout(() => setCopiedInput(false), 2000);
      } catch (err) {
        console.error('Failed to copy input:', err);
      }
    }
  }, [input]);

  const handleCopyOutput = useCallback(async () => {
    if (output) {
      try {
        await copyToClipboard(output);
        setCopiedOutput(true);
        setTimeout(() => setCopiedOutput(false), 2000);
      } catch (err) {
        console.error('Failed to copy output:', err);
      }
    }
  }, [output]);

  const handleLoadFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
        setError(null);
        setIsValid(true);
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  }, []);

  const handleDownloadInput = useCallback(() => {
    if (!input) return;
    
    const blob = new Blob([input], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'input.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [input]);

  const handleDownloadOutput = useCallback(() => {
    if (!output) return;
    
    const blob = new Blob([output], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [output]);

  const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
    <book id="1">
        <title>The Great Gatsby</title>
        <author>F. Scott Fitzgerald</author>
        <price currency="USD">12.99</price>
        <genre>Fiction</genre>
    </book>
    <book id="2">
        <title>To Kill a Mockingbird</title>
        <author>Harper Lee</author>
        <price currency="USD">13.99</price>
        <genre>Fiction</genre>
    </book>
</bookstore>`;

  const handleLoadSample = () => {
    setInput(sampleXML);
    setError(null);
    setIsValid(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xml,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-blue-100 rounded">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">XML Formatter</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={handleFormat}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Code className="h-4 w-4 mr-1.5" />
            Format
          </button>
          <button
            onClick={handleMinify}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <Minimize className="h-4 w-4 mr-1.5" />
            Minify
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Clear
          </button>
          <button
            onClick={handleLoadFile}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors duration-200 font-medium"
          >
            <Upload className="h-4 w-4 mr-1.5" />
            Load File
          </button>
          <button
            onClick={handleLoadSample}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors duration-200 font-medium"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Sample
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-800 text-sm font-medium">Error:</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {isValid && output && !error && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800 text-sm font-medium">XML formatted successfully!</span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">Input XML</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadInput}
                  disabled={!input}
                  className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
                <button
                  onClick={handleCopyInput}
                  disabled={!input}
                  className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedInput ? (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedInput ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-0">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your XML here or use 'Load File' to upload from your computer..."
                className="w-full h-64 p-4 border-0 font-mono text-sm resize-none focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700">Output XML</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadOutput}
                  disabled={!output}
                  className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
                <button
                  onClick={handleCopyOutput}
                  disabled={!output}
                  className="inline-flex items-center px-3 py-1 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedOutput ? (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedOutput ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="p-0">
              <textarea
                value={output}
                readOnly
                placeholder="Formatted XML will appear here..."
                className="w-full h-64 p-4 border-0 font-mono text-sm resize-none bg-gray-50 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="text-center text-sm text-gray-600 space-y-2">
          <p>
            <strong>Format:</strong> Beautify and indent XML for better readability
          </p>
          <p>
            <strong>Minify:</strong> Remove whitespace to reduce file size
          </p>
          <p>
            <strong>Load File:</strong> Upload XML files from your computer
          </p>
          <p>
            <strong>Download:</strong> Save formatted XML to your device
          </p>
        </div>
      </div>
    </div>
  );
};

export default XMLFormatter;