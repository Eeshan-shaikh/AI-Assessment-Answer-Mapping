import { useState, useEffect } from 'react';
import { AssessmentResult } from '@/types/assessment';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnswerHighlight } from './AnswerHighlight';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AnswerViewerProps {
  data: AssessmentResult;
  selectedQuestionId: string | null;
}

export function AnswerViewer({ data, selectedQuestionId }: AnswerViewerProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);

  // Find the answer for the selected question
  const mapping = data.mappings.find((m) => m.questionId === selectedQuestionId);
  const answer = mapping?.answerId ? data.answers.find((a) => a.id === mapping.answerId) : null;
  const currentPage = answer?.pages[0] || 1;

  useEffect(() => {
    // We migrated to saving answerFileUrl and answerFileType
    const savedUrl = sessionStorage.getItem('answerFileUrl');
    const savedType = sessionStorage.getItem('answerFileType');
    
    if (savedUrl) setFileUrl(savedUrl);
    if (savedType) setFileType(savedType);
    
    // Fallback for older sessions
    if (!savedUrl && sessionStorage.getItem('answerImageUrl')) {
      setFileUrl(sessionStorage.getItem('answerImageUrl'));
      setFileType('image/png');
    }
  }, []);

  const isPdf = fileType === 'application/pdf';

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="h-12 bg-gray-900 text-gray-300 flex items-center justify-between px-4 shrink-0">
        <div className="text-sm font-medium text-white">Answer Sheet</div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-gray-800 rounded-md px-2 py-1">
            <button className="hover:text-white"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-medium w-10 text-center">100%</span>
            <button className="hover:text-white"><ZoomIn className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-800 rounded-md px-2 py-1">
            <button className="hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-medium">Page {currentPage} of {isPdf ? numPages : 1}</span>
            <button className="hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Document Viewer Area */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4 md:p-8 flex justify-center relative">
        
        {/* Page Container */}
        <div 
          className="bg-white shadow-lg relative bg-cover bg-center bg-no-repeat"
          style={{ 
            width: '800px', 
            height: '1131px', // Standard A4 ratio for reference
            backgroundImage: (!isPdf && fileUrl) ? `url(${fileUrl})` : 'none'
          }}
        >
          {/* Render PDF if it's a PDF */}
          {isPdf && fileUrl && (
            <Document 
              file={fileUrl} 
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              className="absolute inset-0 w-full h-full"
            >
              <Page 
                pageNumber={currentPage} 
                width={800} // Force width to match our 800x1131 reference mapping
                renderTextLayer={false} 
                renderAnnotationLayer={false}
              />
            </Document>
          )}

          {/* Lined Paper Background effect (only if no image or pdf uploaded) */}
          {!fileUrl && (
            <>
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  backgroundImage: 'linear-gradient(transparent 95%, #4299e1 95%)', 
                  backgroundSize: '100% 40px',
                  marginTop: '80px'
                }}
              ></div>
              <div className="absolute left-24 top-0 bottom-0 w-px bg-red-400 opacity-40"></div>
              
              <div className="absolute inset-0 p-12 pl-32 font-serif text-blue-900/80 text-xl leading-[40px] pt-[85px]">
                <p className="mb-10"><span className="absolute left-10 font-bold">Q1.</span> The heart is an organ that pumps blood throughout the body. The <span className="font-bold border-b border-blue-900/40">Artery</span> is the blood vessel that carries blood away from the heart.</p>
                <p className="mb-10"><span className="absolute left-10 font-bold">Q2.</span> Photosynthesis is the process used by plants. The <span className="font-bold border-b border-blue-900/40">Chloroplast</span> is the organelle primarily involved in this process.</p>
              </div>
            </>
          )}

          {/* Highlights */}
          {answer && answer.regions.map((region, idx) => {
            if (region.page !== currentPage) return null;
            return (
              <AnswerHighlight key={idx} region={region} label={answer.detectedQuestionLabel} />
            );
          })}
        </div>

      </div>
    </div>
  );
}
