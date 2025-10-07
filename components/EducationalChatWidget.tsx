import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QuickQuestion {
  question: string;
  answer: string;
}

export default function EducationalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showProactive, setShowProactive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Educational quick questions
  const quickQuestions: QuickQuestion[] = [
    {
      question: "What is soil biology?",
      answer: "Soil biology refers to the living organisms in soil - bacteria, fungi, protozoa, nematodes, and earthworms. These microorganisms work together to break down organic matter, cycle nutrients, improve soil structure, and help plants resist diseases. Healthy soil can contain billions of microorganisms in just a teaspoon!"
    },
    {
      question: "Why avoid synthetic fertilizers?",
      answer: "Synthetic fertilizers provide quick nutrients but harm soil biology. They kill beneficial microbes, compact soil structure, pollute waterways, and create plant dependency. Over time, soil becomes lifeless and requires more chemicals. Organic fertilizers feed the soil ecosystem, creating long-term fertility naturally."
    },
    {
      question: "How does biochar work?",
      answer: "Biochar is charcoal made from organic material. Its porous structure acts like a sponge, holding water and nutrients while providing habitat for beneficial microbes. It improves soil structure, increases water retention by up to 18%, and can remain in soil for hundreds of years, making it a permanent soil improvement."
    },
    {
      question: "What are humic acids?",
      answer: "Humic acids are organic compounds formed from decomposed plant matter. They act as a natural chelator, making nutrients more available to plants. They improve soil structure, increase water retention, stimulate root growth, and enhance nutrient uptake. Think of them as nature's soil conditioner!"
    },
    {
      question: "How to fix compacted soil?",
      answer: "Compacted soil lacks air spaces needed for roots and microbes. Fix it by: 1) Adding organic matter (compost, biochar), 2) Using liquid soil amendments to penetrate deep, 3) Avoiding tilling when wet, 4) Growing deep-rooted cover crops, 5) Reducing foot traffic. Improvement takes time but results are worth it!"
    },
    {
      question: "What is the soil food web?",
      answer: "The soil food web is the complex network of organisms that live in soil. Bacteria and fungi decompose organic matter, protozoa and nematodes eat bacteria, and larger organisms like earthworms create channels and castings. Each level feeds the next, cycling nutrients and creating healthy, living soil."
    }
  ];

  // Show proactive message after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !sessionStorage.getItem('chatProactiveShown')) {
        setShowProactive(true);
        sessionStorage.setItem('chatProactiveShown', 'true');
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Hi! I'm here to help you learn about soil health and organic gardening. Ask me anything about soil biology, composting, or how our products work!"
      );
    }
  }, [isOpen]);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickQuestion = (qa: QuickQuestion) => {
    addUserMessage(qa.question);
    setTimeout(() => {
      addBotMessage(qa.answer);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userQuestion = inputText.trim();
    addUserMessage(userQuestion);
    setInputText('');

    // Simple keyword matching for educational responses
    setTimeout(() => {
      const lowerQuestion = userQuestion.toLowerCase();
      
      // Check for matches in quick questions
      const match = quickQuestions.find(qa => 
        lowerQuestion.includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
      );

      if (match) {
        addBotMessage(match.answer);
      } else if (lowerQuestion.includes('ph') || lowerQuestion.includes('acid')) {
        addBotMessage("Soil pH affects nutrient availability. Most plants prefer 6.0-7.0 pH. Below 6.0 is acidic (add lime), above 7.5 is alkaline (add sulfur). Test your soil first! Our humic acids help buffer pH naturally.");
      } else if (lowerQuestion.includes('compost') || lowerQuestion.includes('composting')) {
        addBotMessage("Composting transforms organic waste into nutrient-rich soil amendment. Key factors: 1) Carbon:Nitrogen ratio (30:1), 2) Moisture (like a wrung sponge), 3) Oxygen (turn regularly), 4) Temperature (130-150°F kills pathogens). Our Enhanced Living Compost is ready to use immediately!");
      } else if (lowerQuestion.includes('worm') || lowerQuestion.includes('casting')) {
        addBotMessage("Worm castings are nature's perfect fertilizer! They contain beneficial microbes, enzymes, and nutrients in plant-available form. They improve soil structure, water retention, and disease resistance. Our products contain 20% premium worm castings for maximum benefit.");
      } else if (lowerQuestion.includes('organic') || lowerQuestion.includes('natural')) {
        addBotMessage("Organic growing works with nature, not against it. It builds soil health over time, creates resilient plants, protects water quality, and produces nutrient-dense food. All our products are certified organic and safe for children, pets, and pollinators!");
      } else if (lowerQuestion.includes('how often') || lowerQuestion.includes('application')) {
        addBotMessage("Application frequency depends on the product: Liquid fertilizers every 7-14 days during growing season, soil amendments 2-4 times per year, compost anytime as mulch or soil mix. Start with label directions and adjust based on plant response.");
      } else if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('buy')) {
        addBotMessage("I'm here to educate about soil health! For product pricing and purchases, please browse our products above. Each product page has detailed information, pricing, and purchase options. Is there anything about soil science I can help explain?");
      } else {
        addBotMessage("That's a great question! While I focus on soil health education, I'd be happy to explain: soil biology, composting, pH, nutrients, organic vs synthetic, or how specific amendments work. What would you like to learn about?");
      }
    }, 800);
  };

  return (
    <>
      {/* Proactive Message */}
      {showProactive && !isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl p-4 max-w-xs z-40 animate-slideIn">
          <button
            onClick={() => setShowProactive(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                🌱 Learn About Soil Health
              </p>
              <p className="text-xs text-gray-600 mb-2">
                Have questions about organic gardening or how soil works?
              </p>
              <button
                onClick={() => {
                  setShowProactive(false);
                  setIsOpen(true);
                }}
                className="text-green-600 text-sm font-semibold hover:text-green-700"
              >
                Ask me anything →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full p-4 shadow-2xl hover:from-green-700 hover:to-green-800 z-50 transition-all transform hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              ?
            </span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold">Soil Health Education</h3>
                <p className="text-xs text-green-100">Ask me about organic gardening</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 bg-white border-t space-y-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">Quick Questions:</p>
              <div className="space-y-2">
                {quickQuestions.slice(0, 3).map((qa, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(qa)}
                    className="w-full text-left text-xs bg-green-50 hover:bg-green-100 text-green-800 rounded-lg p-2 transition-colors"
                  >
                    {qa.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about soil health..."
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-green-600"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
