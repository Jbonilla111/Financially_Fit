import React, { useState } from 'react';
import './ExternalResourcesPage.css';
import Navbar from '../components/Navbar';

const resources = [
  { title: 'What is Budgeting?', description: 'Learn the basics of budgeting and how to manage your money effectively.', category: 'Budgeting', url: 'https://www.investopedia.com/terms/b/budget.asp' },
  { title: 'Investing 101', description: 'A beginner\'s guide to investing in stocks, bonds, and mutual funds.', category: 'Investing', url: 'https://www.investopedia.com/articles/basics/06/invest1000.asp' },
  { title: 'How to Build an Emergency Fund', description: 'Why you need an emergency fund and how to start building one today.', category: 'Savings', url: 'https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters' },
  { title: 'Understanding Credit Scores', description: 'What your credit score means and how to improve it over time.', category: 'Credit', url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-score-en-315/' },
  { title: 'Life Insurance Explained', description: 'Everything you need to know about life insurance and which type is right for you.', category: 'Insurance', url: 'https://www.investopedia.com/terms/l/lifeinsurance.asp' },
  { title: 'How to Get Out of Debt', description: 'Practical strategies for paying off debt and becoming financially free.', category: 'Debt', url: 'https://www.nerdwallet.com/article/finance/how-to-get-out-of-debt' },
  { title: 'Retirement Planning Basics', description: 'How to plan for retirement and make the most of your savings.', category: 'Investing', url: 'https://www.investopedia.com/retirement-planning-4689695' },
  { title: 'The 50/30/20 Budget Rule', description: 'A simple budgeting method to help you save, spend, and invest wisely.', category: 'Budgeting', url: 'https://www.nerdwallet.com/article/finance/nerdwallet-budget-calculator' },
  { title: 'Introduction to Compound Interest', description: 'How compound interest works and why starting early matters.', category: 'Savings', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial' },
];

const categories = ['All', 'Budgeting', 'Investing', 'Savings', 'Credit', 'Insurance', 'Debt'];

function ExternalResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? resources
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="resources-page">
      <Navbar />
      <div className="resources-container">
        <h1>External Resources</h1>
        <p className="resources-subtitle">Explore trusted resources to help you on your financial literacy journey.</p>
        <div className="category-filters">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="resources-grid">
          {filtered.map((resource, index) => (
            <div key={index} className="resource-card">
              <span className="resource-category">{resource.category}</span>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a href={resource.url} target="_blank" rel="noreferrer">
                <button className="read-more-btn">Read More</button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExternalResourcesPage;
