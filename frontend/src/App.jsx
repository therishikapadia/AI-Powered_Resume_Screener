import { useState, useEffect } from 'react'
import { Sun, Moon, PlusCircle, ChevronRight, ChevronDown, ChevronUp, Briefcase, UploadCloud, CheckCircle2, AlertCircle, Trash2, MessageSquare, Send } from 'lucide-react'
import axios from 'axios'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [view, setView] = useState('dashboard');
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API_BASE + '/');
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 transition-colors duration-300 font-sans dark:bg-[#0a0a0a] bg-blue-50/50">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-blue-100 dark:border-white/10">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setView('dashboard')}>
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-white" />
            <h1 className="text-2xl font-bold text-blue-900 dark:text-white">
              AI Screener Pro
            </h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full hover:bg-blue-50 dark:hover:bg-white/10 transition">
            {darkMode ? <Sun className="w-6 h-6 text-white" /> : <Moon className="w-6 h-6 text-blue-600" />}
          </button>
        </header>

        <main className="bg-white dark:bg-black rounded-3xl p-6 sm:p-10 shadow-sm border border-blue-100 dark:border-white/10 min-h-[60vh]">
          {view === 'dashboard' && <Dashboard jobs={jobs} setView={setView} setSelectedJob={setSelectedJob} fetchJobs={fetchJobs} />}
          {view === 'createJob' && <CreateJob setView={setView} refreshJobs={fetchJobs} />}
          {view === 'jobDetails' && <JobDetails job={selectedJob} setView={setView} refreshJobs={fetchJobs} updateJobState={setSelectedJob} />}
        </main>
      </div>
    </div>
  )
}

function Dashboard({ jobs, setView, setSelectedJob, fetchJobs }) {
  useEffect(() => {
    fetchJobs()
  }, [])

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this job posting and all its candidates?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchJobs();
      } catch(err) {
        alert("Error deleting job.");
      }
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900 dark:text-white">Active Job Postings</h2>
        <button 
          onClick={() => setView('createJob')}
          className="flex items-center space-x-2 bg-blue-600 dark:bg-white hover:bg-blue-700 dark:hover:bg-gray-200 text-white dark:text-black px-5 py-2.5 rounded-xl font-medium transition-all shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {jobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => { setSelectedJob(job); setView('jobDetails'); }}
            className="group relative bg-blue-50/50 dark:bg-[#111] border border-blue-100 dark:border-white/10 hover:border-blue-500 dark:hover:border-white/40 rounded-2xl p-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl dark:shadow-none"
          >
            <button 
              onClick={(e) => handleDelete(e, job.id)} 
              className="absolute top-4 right-4 p-2 bg-white dark:bg-black rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-blue-100 dark:border-white/10 hover:text-red-500 dark:hover:text-red-400 text-gray-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold mb-2 text-blue-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors pr-8">{job.title}</h3>
            <p className="text-blue-800/60 dark:text-gray-400 line-clamp-3 text-sm mb-4">
              {job.description}
            </p>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="bg-white dark:bg-white/10 text-blue-700 dark:text-gray-300 border border-blue-100 dark:border-transparent px-3 py-1 rounded-full">
                {job.candidates?.length || 0} Candidates
              </span>
              <ChevronRight className="w-5 h-5 text-blue-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="col-span-full py-12 text-center text-blue-800/50 dark:text-gray-500">
            No job postings yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  )
}

function CreateJob({ setView, refreshJobs }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_BASE + '/', { title, description });
      await refreshJobs();
      setView('dashboard');
    } catch (e) {
      console.error(e);
      alert("Failed to create job");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => setView('dashboard')} className="text-blue-500 dark:text-gray-400 font-medium hover:underline">
          &larr; Back
        </button>
        <h2 className="text-3xl font-bold text-blue-900 dark:text-white">Create New Job Posting</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-blue-900 dark:text-gray-300">Role Title</label>
          <input 
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-blue-50/50 dark:bg-[#111] border border-blue-200 dark:border-white/10 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-white outline-none transition"
            placeholder="e.g. Senior Frontend Engineer"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-blue-900 dark:text-gray-300">Job Description</label>
          <textarea 
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-blue-50/50 dark:bg-[#111] border border-blue-200 dark:border-white/10 text-blue-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-white outline-none transition resize-none"
            placeholder="Enter the full job description here..."
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-gray-200 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg dark:shadow-none"
        >
          {loading ? 'Creating...' : 'Create Job Posting'}
        </button>
      </form>
    </div>
  )
}

function JobDetails({ job, setView, refreshJobs, updateJobState }) {
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [expandedCandidates, setExpandedCandidates] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    if (job?.id) {
       axios.get(`${API_BASE}/${job.id}`).then(res => {
         updateJobState(res.data);
       })
    }
  }, [job?.id])

  const toggleExpand = (cid) => {
    setExpandedCandidates(prev => ({...prev, [cid]: !prev[cid]}));
  }

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setLoadingUpload(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
       formData.append('files', files[i]);
    }

    try {
      await axios.post(`${API_BASE}/${job.id}/candidates/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const res = await axios.get(`${API_BASE}/${job.id}`);
      updateJobState(res.data);
      refreshJobs();
    } catch (err) {
      console.error(err);
      alert('Error uploading files');
    }
    setLoadingUpload(false);
    e.target.value = null; // reset
  }

  const handleDeleteCandidate = async (cid) => {
    if(confirm("Remove this candidate?")) {
      try {
        await axios.delete(`${API_BASE}/${job.id}/candidates/${cid}`);
        const res = await axios.get(`${API_BASE}/${job.id}`);
        updateJobState(res.data);
        refreshJobs();
      } catch (err) {
        alert("Error deleting candidate.");
      }
    }
  }

  const handleRank = async () => {
    setRanking(true);
    try {
      await axios.post(`${API_BASE}/${job.id}/rank`);
      const res = await axios.get(`${API_BASE}/${job.id}`);
      updateJobState(res.data);
      // Auto expand all when ranked
      const exps = {};
      res.data.candidates.forEach(c => exps[c.id] = true);
      setExpandedCandidates(exps);
    } catch (e) {
      console.error(e);
      alert('Error ranking candidates. Ensure API key is valid.');
    }
    setRanking(false);
  }

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, {role: 'user', text: userMsg}]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/${job.id}/chat`, { question: userMsg });
      setChatMessages(prev => [...prev, {role: 'bot', text: res.data.answer}]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {role: 'bot', text: 'Error connecting to AI...' }]);
    }
    setChatLoading(false);
  }

  if (!job) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => setView('dashboard')} className="text-blue-500 dark:text-gray-400 font-medium hover:underline">
          &larr; Back
        </button>
        <div>
          <h2 className="text-3xl font-bold text-blue-900 dark:text-white">{job.title}</h2>
          <p className="text-blue-800/60 dark:text-gray-500 text-sm mt-1">Created on {new Date(job.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-blue-50/50 dark:bg-[#111] rounded-2xl p-6 border border-blue-100 dark:border-white/10">
            <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-white">Job Description</h3>
            <div className="text-sm text-blue-900/70 dark:text-gray-400 whitespace-pre-wrap max-h-64 overflow-y-auto pr-2">
              {job.description}
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-blue-200 dark:border-white/10 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-white/10 text-blue-600 dark:text-white rounded-full flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900 dark:text-white">Upload Candidates</h3>
              <p className="text-sm text-blue-800/60 dark:text-gray-500 mt-1">Select PDF Resumes</p>
            </div>
            
            <label className="block w-full cursor-pointer bg-blue-600 dark:bg-white text-white dark:text-black hover:bg-blue-700 dark:hover:bg-gray-200 py-2.5 rounded-xl font-bold transition-colors">
              {loadingUpload ? 'Uploading...' : 'Select PDFs'}
              <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={loadingUpload} />
            </label>
          </div>
          
          <button 
            onClick={handleRank}
            disabled={ranking || job.candidates.length === 0}
            className="w-full border-2 border-blue-600 dark:border-white bg-blue-600 dark:bg-transparent hover:bg-blue-700 dark:hover:bg-white dark:hover:text-black text-white py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ranking ? 'Analyzing...' : '⚡ Rank Candidates'}
          </button>

          {/* RAG Chat Component */}
          {job.candidates.length > 0 && (
            <div className="bg-white dark:bg-[#111] rounded-2xl border border-blue-200 dark:border-white/10 flex flex-col h-96 overflow-hidden">
               <div className="bg-blue-600 dark:bg-white text-white dark:text-black p-4 font-bold flex items-center shadow-md z-10">
                 <MessageSquare className="w-5 h-5 mr-2" />
                 Query Resumes (AI Chat)
               </div>
               
               <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-blue-50/30 dark:bg-black/50 text-sm">
                 {chatMessages.length === 0 && (
                   <p className="text-center text-blue-800/50 dark:text-gray-500 mt-10">Ask a question about the candidates! (e.g. "Who has the most frontend experience?")</p>
                 )}
                 {chatMessages.map((msg, idx) => (
                   <div key={idx} className={cn("max-w-[85%] rounded-2xl p-3", msg.role === 'user' ? "bg-blue-600 text-white self-end ml-auto rounded-tr-sm" : "bg-white dark:bg-[#222] border border-blue-100 dark:border-white/10 text-blue-900 dark:text-gray-200 self-start mr-auto rounded-tl-sm")}>
                     {msg.text}
                   </div>
                 ))}
                 {chatLoading && (
                   <div className="bg-white dark:bg-[#222] border border-blue-100 dark:border-white/10 text-blue-900 dark:text-gray-400 self-start mr-auto rounded-2xl rounded-tl-sm p-3 w-16 flex justify-center animate-pulse">
                     ...
                   </div>
                 )}
               </div>

               <form onSubmit={handleChat} className="p-3 bg-white dark:bg-[#111] border-t border-blue-100 dark:border-white/10 flex items-center space-x-2 relative z-10">
                 <input 
                   value={chatInput}
                   onChange={e => setChatInput(e.target.value)}
                   type="text" 
                   disabled={chatLoading}
                   placeholder="Ask AI..." 
                   className="flex-1 bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 text-blue-900 dark:text-white disabled:opacity-50"
                 />
                 <button type="submit" disabled={chatLoading} className="p-2 bg-blue-600 dark:bg-white text-white dark:text-black rounded-xl hover:bg-blue-700 dark:hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed">
                   <Send className="w-4 h-4" />
                 </button>
               </form>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-blue-900 dark:text-white">
            <span>Evaluated Candidates ({job.candidates?.length || 0})</span>
          </h3>

          {job.candidates?.length === 0 ? (
            <div className="bg-blue-50/50 dark:bg-[#111] rounded-2xl p-12 border border-dashed border-blue-200 dark:border-white/20 text-center text-blue-400 dark:text-gray-500">
              No candidates uploaded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {[...job.candidates].sort((a,b) => (b.evaluation?.score || 0) - (a.evaluation?.score || 0)).map((c, idx) => {
                const isExpanded = expandedCandidates[c.id];
                return (
                <div key={c.id} className="bg-white dark:bg-[#111] rounded-2xl border border-blue-200 dark:border-white/10 shadow-sm relative overflow-hidden group">
                  
                  {c.evaluation && (
                    <div className="absolute top-0 right-0 rounded-bl-2xl font-bold px-4 py-1.5 text-white dark:text-black dark:bg-white bg-blue-900 shadow-sm z-10 text-sm">
                      Rank #{idx + 1}
                    </div>
                  )}

                  <div className="p-5 pr-20 flex justify-between items-start">
                     <div>
                        <h4 className="font-bold text-lg text-blue-900 dark:text-white break-words pr-4">{c.filename}</h4>
                        {!c.evaluation && (
                          <span className="mt-2 text-xs font-bold text-blue-600 dark:text-gray-400 bg-blue-50 dark:bg-white/10 px-2 py-1 rounded-md inline-block">
                            Pending AI Evaluation
                          </span>
                        )}
                        {c.evaluation && (
                           <div className="flex items-center space-x-3 mt-2">
                             <span className="bg-blue-100 dark:bg-white text-blue-900 dark:text-black font-black px-3 py-1 rounded-lg text-lg">
                               {c.evaluation.score}/10
                             </span>
                             <button onClick={() => toggleExpand(c.id)} className="text-sm font-bold text-blue-500 dark:text-gray-400 hover:underline flex items-center">
                               {isExpanded ? 'Hide Details' : 'View AI Evaluation'}
                               {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                             </button>
                           </div>
                        )}
                     </div>
                     <button onClick={() => handleDeleteCandidate(c.id)} className="p-2 text-blue-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition bg-blue-50 dark:bg-white/5 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Collapsible Evaluation Content */}
                  {c.evaluation && isExpanded && (
                    <div className="bg-blue-50/50 dark:bg-black/50 p-5 border-t border-blue-100 dark:border-white/5">
                        <p className="text-sm text-blue-900 dark:text-gray-300 leading-relaxed mb-4">
                          <strong>Reasoning:</strong> {c.evaluation.reasoning}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-blue-100 dark:border-white/5">
                             <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-white flex items-center mb-2">
                               <CheckCircle2 className="w-4 h-4 mr-1"/> Pros
                             </h5>
                             <ul className="space-y-1">
                               {c.evaluation.pros.map((p,i) => <li key={i} className="text-sm text-blue-800/80 dark:text-gray-400 flex items-start"><span className="text-blue-400 dark:text-gray-500 mr-2 mt-0.5">•</span> {p}</li>)}
                             </ul>
                           </div>
                           <div className="bg-white dark:bg-[#111] p-4 rounded-xl border border-blue-100 dark:border-white/5">
                             <h5 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-gray-400 flex items-center mb-2">
                               <AlertCircle className="w-4 h-4 mr-1"/> Cons
                             </h5>
                             <ul className="space-y-1">
                               {c.evaluation.cons.map((p,i) => <li key={i} className="text-sm text-blue-800/80 dark:text-gray-400 flex items-start"><span className="text-blue-400 dark:text-gray-500 mr-2 mt-0.5">•</span> {p}</li>)}
                             </ul>
                           </div>
                        </div>
                    </div>
                  )}

                </div>
              )})}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
