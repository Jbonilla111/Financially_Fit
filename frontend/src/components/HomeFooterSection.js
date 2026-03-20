import React, { useState } from 'react';
import './HomeFooterSection.css';

const quotes = [
  { text: "The secret to getting ahead is getting started.", author: "Mark Twain" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki" },
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "It's not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
];

const tips = [
  { title: "Start an Emergency Fund", tip: "Aim to save 3-6 months of expenses in a liquid account for unexpected costs.", category: "Savings" },
  { title: "The 50/30/20 Rule", tip: "Spend 50% on needs, 30% on wants, and save 20% of your income every month.", category: "Budgeting" },
  { title: "Pay Yourself First", tip: "Set up automatic transfers to savings before spending on anything else.", category: "Savings" },
  { title: "Avoid Lifestyle Inflation", tip: "When your income increases, resist the urge to increase your spending proportionally.", category: "Mindset" },
];

function HomeFooterSection() {
  const [quoteIndex] = useState(Math.floor(Math.random() * quotes.length));
  const quote = quotes[quoteIndex];

  return (
    <div className="footer-section">
      <div className="quote-card">
        <p className="quote-icon">💡</p>
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>

      <div className="tips-section">
        <h2>Daily Financial Tips</h2>
        <div className="tips-grid">
          {tips.map((tip, index) => (
            <div key={index} className="tip-card">
              <span className="tip-category">{tip.category}</span>
              <h3>{tip.title}</h3>
              <p>{tip.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeFooterSection;