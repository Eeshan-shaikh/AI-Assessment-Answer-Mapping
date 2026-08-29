'use client';
import { useState } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { UploadCard } from '@/components/upload/UploadCard';
import { FilePreview } from '@/components/upload/FilePreview';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';

export default function ExamsPage() {
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleStartMapping = async () => {
    if (!questionFile || !answerFile) return;
    
    setIsProcessing(true);
    try {
      // 1. Prepare form data for Question Paper
      const qFormData = new FormData();
      qFormData.append('file', questionFile);
      
      // 2. Prepare form data for Answer Sheet
      const aFormData = new FormData();
      aFormData.append('file', answerFile);
      
      // 3. Call both API routes in parallel
      const [qResponse, aResponse] = await Promise.all([
        fetch('/api/extract-questions', { method: 'POST', body: qFormData }),
        fetch('/api/extract-answers', { method: 'POST', body: aFormData })
      ]);
      
      if (!qResponse.ok) {
        const errText = await qResponse.text();
        throw new Error(`Question API Error: ${qResponse.status} ${errText}`);
      }
      if (!aResponse.ok) {
        const errText = await aResponse.text();
        throw new Error(`Answer API Error: ${aResponse.status} ${errText}`);
      }
      
      const qData = await qResponse.json();
      const aData = await aResponse.json();
      
      let finalMappings = [];
      if (qData.questions && aData.answers) {
        // 4. Map answers to questions
        const mResponse = await fetch('/api/map-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questions: qData.questions, answers: aData.answers })
        });
        if (mResponse.ok) {
          const mData = await mResponse.json();
          if (mData.mappings) {
            finalMappings = mData.mappings;
          }
        }
      }
      
      // 5. Store the results in sessionStorage to pass to the next page
      if (qData.questions) sessionStorage.setItem('extractedQuestions', JSON.stringify(qData.questions));
      if (aData.answers) sessionStorage.setItem('extractedAnswers', JSON.stringify(aData.answers));
      if (finalMappings.length > 0) sessionStorage.setItem('extractedMappings', JSON.stringify(finalMappings));
      
      // Store object URLs for the files so we can display them (temporary for this session)
      if (questionFile) {
        sessionStorage.setItem('questionFileUrl', URL.createObjectURL(questionFile));
        sessionStorage.setItem('questionFileType', questionFile.type);
      }
      if (answerFile) {
        sessionStorage.setItem('answerFileUrl', URL.createObjectURL(answerFile));
        sessionStorage.setItem('answerFileType', answerFile.type);
      }
      
      // 6. Redirect to mapping screen
      router.push('/exams/mapping');
    } catch (error: any) {
      console.error('Full extraction error:', error);
      alert(`Extraction failed: ${error.message}`);
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="h-full w-full flex flex-col">
        <TopHeader />
        <MobileHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full relative">
          <div className="text-center animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-500">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Extracting...</h2>
            <p className="text-gray-500">This may take a while</p>
          </div>
        </div>
      </div>
    );
  }

  const canStartMapping = questionFile && answerFile;

  return (
    <div className="h-full w-full flex flex-col bg-[#F9FAFB]">
      <TopHeader />
      <MobileHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-3">
            Upload <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full">Question Paper & Answer Sheets</span>
          </h1>
          <p className="text-gray-500 text-center mb-12">
            Upload both files to get started
          </p>

          <div className="w-24 h-24 bg-orange-100 rounded-full mb-12 flex items-center justify-center relative shadow-sm border-[6px] border-white ring-1 ring-gray-100">
            {/* Using a placeholder avatar since we don't have the Figma illustration */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-400 to-orange-500 overflow-hidden flex flex-col items-center justify-end pt-2">
              <div className="w-12 h-12 bg-gray-900 rounded-t-full rounded-b-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20"></div>
              </div>
            </div>
            
            {/* Sparks */}
            <div className="absolute -top-1 -right-2 w-3 h-3 bg-orange-400 rounded-full"></div>
            <div className="absolute top-4 -left-4 w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="absolute bottom-2 -right-4 w-2 h-2 bg-orange-400 rounded-full"></div>
            <div className="absolute -bottom-4 left-4 w-3 h-3 bg-orange-400 rounded-full"></div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {!questionFile ? (
              <div className="relative">
                <input 
                  type="file" 
                  accept="application/pdf,image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setQuestionFile(e.target.files[0]);
                    }
                  }} 
                />
                <UploadCard 
                  title={<>Upload <span className="text-orange-500">Question Paper</span></>}
                />
              </div>
            ) : (
              <FilePreview
                fileName={questionFile.name}
                size={`${(questionFile.size / 1024 / 1024).toFixed(2)}MB`}
                pages={1} // mock
                onRemove={() => setQuestionFile(null)}
              />
            )}

            {!answerFile ? (
              <div className="relative">
                <input 
                  type="file" 
                  accept="application/pdf,image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAnswerFile(e.target.files[0]);
                    }
                  }} 
                />
                <UploadCard 
                  title={<>Upload <span className="text-orange-500">Answer Sheet</span></>}
                />
              </div>
            ) : (
              <FilePreview
                fileName={answerFile.name}
                size={`${(answerFile.size / 1024 / 1024).toFixed(2)}MB`}
                pages={1} // mock
                onRemove={() => setAnswerFile(null)}
              />
            )}
          </div>

          <button
            onClick={handleStartMapping}
            disabled={!canStartMapping}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all ${
              canStartMapping
                ? 'bg-gray-400 text-white shadow-md hover:bg-gray-500'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Mapping <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-xs text-gray-400 mt-4 text-center max-w-xs">
            Once both files are uploaded, you'll be able to map answers with questions
          </p>
        </div>
      </div>
    </div>
  );
}
