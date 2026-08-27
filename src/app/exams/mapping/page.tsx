'use client';
import { useState, useEffect } from 'react';
import { TopHeader } from '@/components/layout/TopHeader';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { QuestionList } from '@/components/mapping/QuestionList';
import { mockData } from '@/lib/mockData';
import { AssessmentResult } from '@/types/assessment';
import dynamic from 'next/dynamic';

const AnswerViewer = dynamic(
  () => import('@/components/mapping/AnswerViewer').then(mod => mod.AnswerViewer),
  { ssr: false }
);

export default function MappingPage() {
  const [data, setData] = useState<AssessmentResult>(mockData);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    // Try to load real extracted questions, answers, and mappings
    const savedQuestions = sessionStorage.getItem('extractedQuestions');
    const savedAnswers = sessionStorage.getItem('extractedAnswers');
    const savedMappings = sessionStorage.getItem('extractedMappings');
    
    let nextData = { ...mockData };
    
    if (savedQuestions) {
      try {
        const questions = JSON.parse(savedQuestions);
        if (questions && questions.length > 0) {
          nextData.questions = questions;
          setSelectedQuestionId(questions[0].id);
        }
      } catch (e) {
        console.error("Failed to parse saved questions", e);
      }
    }
    
    if (savedAnswers) {
      try {
        const answers = JSON.parse(savedAnswers);
        if (answers && answers.length > 0) {
          nextData.answers = answers;
        }
      } catch (e) {
        console.error("Failed to parse saved answers", e);
      }
    }

    if (savedMappings) {
      try {
        const mappings = JSON.parse(savedMappings);
        if (mappings && mappings.length > 0) {
          nextData.mappings = mappings;
        }
      } catch (e) {
        console.error("Failed to parse saved mappings", e);
      }
    }
    
    setData(nextData);
    if (!selectedQuestionId && nextData.questions.length > 0) {
      setSelectedQuestionId(nextData.questions[0].id);
    }
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-[#F9FAFB]">
      <TopHeader />
      <MobileHeader />
      
      {/* Mobile Tab Navigation - simple version for now */}
      <div className="md:hidden flex border-b border-gray-200 bg-white px-4 py-2 gap-2">
        <button className="flex-1 py-2 px-4 rounded-full bg-gray-900 text-white text-sm font-medium">Questions</button>
        <button className="flex-1 py-2 px-4 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">Answer Sheet</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-0 md:p-4 gap-4">
        {/* Left Pane - Questions */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-50 md:rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Extracted Questions <span className="text-gray-400 font-normal text-sm">(from question paper)</span></h2>
            <button className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200">Expand All</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <QuestionList 
              data={data} 
              selectedId={selectedQuestionId} 
              onSelect={setSelectedQuestionId} 
            />
          </div>
        </div>

        {/* Right Pane - Answer Sheet */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-200 md:rounded-2xl border border-gray-300 overflow-hidden">
          <AnswerViewer 
            data={data} 
            selectedQuestionId={selectedQuestionId} 
          />
        </div>
      </div>
    </div>
  );
}
