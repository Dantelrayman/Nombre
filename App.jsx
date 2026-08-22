import { useState, useEffect } from 'react';
import { Parser, Calculator } from './index.js';

const precedenceMap = new Map();
precedenceMap.set('(', 0);
precedenceMap.set(')', 0);
precedenceMap.set('+', 1);
precedenceMap.set('-', 1);
precedenceMap.set('/', 2);
precedenceMap.set('*', 2);
precedenceMap.set('^', 3);
precedenceMap.set('√', 3);
precedenceMap.set('u', 5);

export default function App() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const calculate = () => {
    if (!input.trim()) return;
    
    try {
      const parser = new Parser();
      const calculator = new Calculator();
      calculator._parser = parser;
      calculator._precedence = precedenceMap;
      
      const parsedInput = input.replace(/%/g, '/100');
      const expression = calculator.buildExpression(parsedInput);
      const result = calculator.calculateExpression(expression);
      
      const newHistory = [input, ...history].slice(0, 20);
      setHistory(newHistory);
      setHistoryIndex(-1);
      setInput(String(result));
      setError('');
    } catch (err) {
      setError(err.message || 'Error de sintaxis');
    }
  };

  const navigateHistory = (direction) => {
    if (direction === 'up' && history.length > 0 && historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      setError('');
    } else if (direction === 'down') {
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(history[prevIndex]);
        setError('');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
        setError('');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory('down');
    } else if (/^[0-9+\-*/().%]$/.test(e.key)) {
      appendToInput(e.key);
    } else if (e.key === 'Backspace') {
      setInput((prev) => prev.slice(0, -1));
      setError('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const appendToInput = (value) => {
    setInput((prev) => prev + value);
    setError('');
  };

  const clear = () => {
    setInput('');
    setError('');
  };

  const buttons = [
    { label: '(', action: () => appendToInput('('), style: 'calc-btn' },
    { label: ')', action: () => appendToInput(')'), style: 'calc-btn' },
    { label: '%', action: () => appendToInput('%'), style: 'calc-btn' },
    { label: 'AC', action: clear, style: 'calc-btn-rojito' },
    { label: '7', action: () => appendToInput('7'), style: 'calc-btn' },
    { label: '8', action: () => appendToInput('8'), style: 'calc-btn' },
    { label: '9', action: () => appendToInput('9'), style: 'calc-btn' },
    { label: '÷', action: () => appendToInput('/'), style: 'calc-btn' },
    { label: '4', action: () => appendToInput('4'), style: 'calc-btn' },
    { label: '5', action: () => appendToInput('5'), style: 'calc-btn' },
    { label: '6', action: () => appendToInput('6'), style: 'calc-btn' },
    { label: '×', action: () => appendToInput('*'), style: 'calc-btn' },
    { label: '1', action: () => appendToInput('1'), style: 'calc-btn' },
    { label: '2', action: () => appendToInput('2'), style: 'calc-btn' },
    { label: '3', action: () => appendToInput('3'), style: 'calc-btn' },
    { label: '-', action: () => appendToInput('-'), style: 'calc-btn' },
    { label: '0', action: () => appendToInput('0'), style: 'calc-btn' },
    { label: '.', action: () => appendToInput('.'), style: 'calc-btn' },
    { label: '=', action: calculate, style: 'calc-btn-primario' },
    { label: '+', action: () => appendToInput('+'), style: 'calc-btn' },
    { label: '↑ Historial', action: () => navigateHistory('up'), style: 'calc-btn-gordo' },
    { label: '↓ Historial', action: () => navigateHistory('down'), style: 'calc-btn-gordo' }
  ];

  return (
    <div className="calc-wrapper">
      <div className="calc-container">
        
        <div className="flex justify-between items-center text-gray-400 text-sm mb-2">
          <span>SchumiCalcu</span>
          <span>{history.length}/20 guardados</span>
        </div>

        <div className={`calc-display ${error ? 'text-red-500' : 'text-white'}`}>
          {input || '0'}
        </div>

        <div className="min-h-[24px] text-red-400 text-sm text-center">
          {error}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn, index) => (
            <button 
              key={index} 
              onClick={btn.action} 
              className={btn.style}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}