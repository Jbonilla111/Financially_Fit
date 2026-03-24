import React, { useState } from 'react';
import './FoundationsLifeInsurance.css';
import { FaUmbrella } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function FoundationsLifeInsurance() {
  const [expandedModule, setExpandedModule] = useState(null);
  
  const modules = [
    { title: 'Introduction to Life Insurance', duration: '2 min', content: [
      'What is life insurance and why it matters',
      'The role of life insurance in financial planning',
      'Key terms: policyholder, beneficiary, face value, premium, cash value, term, permanent'
    ]},
    { title: 'Types of Life Insurance', duration: '5 min', content: [
      'Term Life Insurance: fixed term, no cash value, pros and cons',
      'Whole Life Insurance: cash value accumulation, fixed premiums',
      'Universal Life Insurance: flexible premiums and death benefits',
      'Variable Life Insurance: investment component and risk',
      'Other types: group, key person, simplified/guaranteed issue'
    ]},
    { title: 'Life Insurance Riders', duration: '5 min', content: [
      'Accidental Death Benefit Rider',
      'Waiver of Premium Rider',
      'Guaranteed Insurability Rider',
      'Long-Term Care Rider',
      'How to choose riders based on goals'
    ]},
    { title: 'Calculating Life Insurance Needs', duration: '10 min', content: [
      'Identify financial obligations: debts, future expenses',
      'Estimate income replacement',
      'Consider existing assets and policies',
      'Choose face amount using formulas',
      'Determine affordable premium'
    ]},
    { title: 'Policy Components', duration: '10 min', content: [
      'Premiums: fixed vs flexible',
      'Cash value growth and loans',
      'Surrender value',
      'Policy dividends',
      'How policies are underwritten'
    ]},
    { title: 'Buying and Managing Life Insurance', duration: '10 min', content: [
      'Selecting an insurance company',
      'Reading and understanding policy contracts',
      'Application and underwriting',
      'Policy management: updates, conversions, beneficiary changes'
    ]},
    { title: 'Life Insurance Strategies', duration: '5 min', content: [
      'Laddering term policies',
      'Using permanent insurance for estate planning',
      'Tax implications',
      'Life insurance as investment vs protection'
    ]},
    { title: 'Case Studies & Practical Exercises', duration: '10 min', content: [
      'Scenario: young professional buying term insurance',
      'Scenario: family planning with whole life',
      'Calculate face amount for different situations',
      'Selecting riders based on needs'
    ]},
    { title: 'Final Quiz', duration: '5 min', content: [
      'Multiple choice and scenario-based questions',
      'Review of key terms and calculations',
      'Certificate of completion'
    ]},
  ];
 const navigate = useNavigate();
  return (
    <div className="foundation-page">
      <div className="foundation-card">
        <FaUmbrella className="foundation-icon" size={60} />
        <h1 className="foundation-title">Foundations of Life Insurance</h1>
        <p className="foundation-duration"> 1 Hour | Beginner Level</p>
        <p className="foundation-description">
          Learn everything you need to understand life insurance : types, riders, calculations, and strategies to protect your family and finances.
        </p>

        <button
  className="start-course-btn"
  onClick={() => navigate('/courses/foundations-life-insurance/start')}
>
  Start Course
</button>

        <h2 className="modules-heading">Modules</h2>
        <div className="modules-list">
          {modules.map((mod, index) => (
            <div key={index} className="module-item">
              <div className="module-header" onClick={() => setExpandedModule(expandedModule === index ? null : index)}>
                <span>{mod.title}</span>
                <span>{mod.duration}</span>
              </div>
              {expandedModule === index && (
                <ul className="module-content">
                  {mod.content.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoundationsLifeInsurance;