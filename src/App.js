import React, { useState, useEffect, useRef } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs';

const API_URL = 'http://95.217.134.12:4010/create-pdf?apiKey=78684310-850d-427a-8432-4a6487f6dbc4'; 

const App = () => {
  const [text, setText] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [history, setHistory] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const textAreaRef = useRef(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem('conversionHistory', JSON.stringify(history));
  }, [history]);
  

  const generateFileName = () => {
    const timestamp = new Date().toISOString().replace(/[^\w\s]/gi, '-');
    return `converted-pdf-${timestamp}.pdf`;
  };

  const handleConvert = async () => {
    if (!text.trim()) {
      textAreaRef.current.focus();
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      const fileName = generateFileName();

      setPdfUrl(pdfUrl);
      setPdfName(fileName);
      setHistory(prevHistory => [...prevHistory, { text, pdfUrl, fileName }]);
    } catch (error) {
      console.error('Error during PDF conversion:', error);
    }
  };


  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    link.click();
  };

  const handleCreateNewFile = () => {
    setText('');
    setPdfUrl('');
    setPdfName('');
  };

  return (
    <div className="container mx-auto p-10 pdf-layout">
      <h1 className="text-2xl font-bold mb-4">Конвертація тексту в PDF <svg xmlns="http://www.w3.org/2000/svg" width="24" fill="#000" height="24" viewBox="0 0 24 24"><path d="M11.363 2c4.155 0 2.637 6 2.637 6s6-1.65 6 2.457v11.543h-16v-20h7.363zm.826-2h-10.189v24h20v-14.386c0-2.391-6.648-9.614-9.811-9.614zm4.811 13h-2.628v3.686h.907v-1.472h1.49v-.732h-1.49v-.698h1.721v-.784zm-4.9 0h-1.599v3.686h1.599c.537 0 .961-.181 1.262-.535.555-.658.587-2.034-.062-2.692-.298-.3-.712-.459-1.2-.459zm-.692.783h.496c.473 0 .802.173.915.644.064.267.077.679-.021.948-.128.351-.381.528-.754.528h-.637v-2.12zm-2.74-.783h-1.668v3.686h.907v-1.277h.761c.619 0 1.064-.277 1.224-.763.095-.291.095-.597 0-.885-.16-.484-.606-.761-1.224-.761zm-.761.732h.546c.235 0 .467.028.576.228.067.123.067.366 0 .489-.109.199-.341.227-.576.227h-.546v-.944z"/></svg></h1>
      <textarea
        ref={textAreaRef}
        className="w-full p-2 border rounded mb-4"
        value={text}
        lang="uk"
        onChange={(e) => setText(e.target.value)}
        placeholder="Введіть текст для конвертації"
      ></textarea>
      <button
        className="bg-orange-500 text-white py-2 px-4 rounded"
        onClick={handleConvert}
      >
        Конвертувати в PDF
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" fill="#fff" clipRule="evenodd"><path d="M24 19h-1v-2.2c-1.853 4.237-6.083 7.2-11 7.2-6.623 0-12-5.377-12-12h1c0 6.071 4.929 11 11 11 4.66 0 8.647-2.904 10.249-7h-2.249v-1h4v4zm-11.036 0h-1.886c-.34-.957-.437-1.571-1.177-1.878h-.001c-.743-.308-1.251.061-2.162.494l-1.333-1.333c.427-.899.804-1.415.494-2.163-.308-.74-.926-.839-1.878-1.177v-1.886c.954-.339 1.57-.437 1.878-1.178.308-.743-.06-1.248-.494-2.162l1.333-1.333c.918.436 1.421.801 2.162.494l.001-.001c.74-.307.838-.924 1.177-1.877h1.886c.34.958.437 1.57 1.177 1.877l.001.001c.743.308 1.252-.062 2.162-.494l1.333 1.333c-.435.917-.801 1.421-.494 2.161v.001c.307.739.915.835 1.878 1.178v1.886c-.953.338-1.571.437-1.878 1.178-.308.743.06 1.249.494 2.162l-1.333 1.333c-.92-.438-1.42-.802-2.157-.496-.746.31-.844.926-1.183 1.88zm-.943-4.667c-1.289 0-2.333-1.044-2.333-2.333 0-1.289 1.044-2.334 2.333-2.334 1.289 0 2.333 1.045 2.333 2.334 0 1.289-1.044 2.333-2.333 2.333zm-8.021-5.333h-4v-4h1v2.2c1.853-4.237 6.083-7.2 11-7.2 6.623 0 12 5.377 12 12h-1c0-6.071-4.929-11-11-11-4.66 0-8.647 2.904-10.249 7h2.249v1z"/></svg>
      </button>
      {pdfUrl && (
        <button
          className="mt-4 ml-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleCreateNewFile}
        >
          Створити новий файл
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" viewBox="0 0 24 24"><path d="M18 13.45l2-2.023v4.573h-2v-2.55zm-11-5.45h1.743l1.978-2h-3.721v2zm1.361 3.216l11.103-11.216 4.536 4.534-11.102 11.218-5.898 1.248 1.361-5.784zm1.306 3.176l2.23-.472 9.281-9.378-1.707-1.707-9.293 9.388-.511 2.169zm3.333 7.608v-2h-6v2h6zm-8-2h-3v-2h-2v4h5v-2zm13-2v2h-3v2h5v-4h-2zm-18-2h2v-4h-2v4zm2-6v-2h3v-2h-5v4h2z"/></svg>
        </button>
      )}

      {pdfUrl && (
        <div className="mt-4 pdf-window">
          <Document
            file={pdfUrl}
            onLoadSuccess={onLoadSuccess}
          >
            {[...Array(numPages)].map((_, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>

          <button
            className="ml-5 mt-6 bg-green-500 text-white py-2 px-4 rounded"
            onClick={downloadPdf}
          >
            Завантажити
            <svg clipRule="evenodd" width="24px" height="24px" fill="#fff" fillRule="evenodd" strokeLinejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m6.864 3.424c.502-.301 1.136.063 1.136.642 0 .264-.138.509-.365.644-2.476 1.486-4.135 4.197-4.135 7.292 0 4.691 3.808 8.498 8.498 8.498s8.497-3.807 8.497-8.498c0-3.093-1.656-5.803-4.131-7.289-.225-.136-.364-.38-.364-.644 0-.582.635-.943 1.137-.642 2.91 1.748 4.858 4.936 4.858 8.575 0 5.519-4.479 9.998-9.997 9.998s-9.998-4.479-9.998-9.998c0-3.641 1.951-6.83 4.864-8.578zm.831 8.582s2.025 2.021 3.779 3.774c.147.147.339.22.53.22.192 0 .384-.073.531-.22 1.753-1.752 3.779-3.775 3.779-3.775.145-.145.217-.336.217-.526 0-.192-.074-.384-.221-.531-.292-.293-.766-.294-1.056-.004l-2.5 2.499v-10.693c0-.414-.336-.75-.75-.75s-.75.336-.75.75v10.693l-2.498-2.498c-.289-.289-.762-.286-1.054.006-.147.147-.221.339-.222.531 0 .19.071.38.215.524z" fillRule="nonzero"/></svg>
          </button>

          <p className="ml-5 mt-4 mb-4 text-sm text-gray-500">Назва файлу: {pdfName}</p>
        </div>
      )}

      <h2 className="text-xl font-bold">Історія конвертацій:</h2>
      {history.length === 0 ? (
        <p className="text-sm text-gray-500">Конвертації відсутні.</p>
      ) : (
        <ul>
          {history.map((item, index) => (
            <li
              key={index}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setPdfUrl(item.pdfUrl)}
            >
              {item.fileName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
