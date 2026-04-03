import React, { useState, useEffect } from 'react';
import './Tools.css';
import Navbar from '../components/Navbar';
import { saveCalculation } from '../api';

function Tools() {
  const [activeTab, setActiveTab] = useState('Loan');
  const [userId, setUserId] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) setUserId(user.id || user.user_id);
}, []);

  // Loan state
  const [loanAmount, setLoanAmount] = useState(200000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [loanResults, setLoanResults] = useState(null);

  // Investment state
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [investmentPeriod, setInvestmentPeriod] = useState(20);
  const [investmentResults, setInvestmentResults] = useState(null);

  // Savings state
  const [currentSavings, setCurrentSavings] = useState(1000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(200);
  const [savingsRate, setSavingsRate] = useState(3);
  const [savingsGoal, setSavingsGoal] = useState(10000);
  const [savingsResults, setSavingsResults] = useState(null);

  // Insurance state
  const [age, setAge] = useState(30);
  const [coverageAmount, setCoverageAmount] = useState(500000);
  const [insuranceType, setInsuranceType] = useState('term');
  const [healthStatus, setHealthStatus] = useState('good');
  const [insuranceResults, setInsuranceResults] = useState(null);

  const calculateLoan = () => {
    if (!loanAmount || loanAmount <= 0) {
      alert('Please enter a valid loan amount greater than 0');
      return;
    }
    if (!interestRate || interestRate <= 0 || interestRate > 100) {
      alert('Please enter a valid interest rate between 0 and 100');
      return;
    }
    if (!loanTerm || loanTerm <= 0) {
      alert('Please enter a valid loan term greater than 0');
      return;
    }
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;
    const monthly = (loanAmount * r) / (1 - Math.pow(1 + r, -n));
    const total = monthly * n;
    const totalInterest = total - loanAmount;
    const results = {
      monthly: monthly.toFixed(2),
      total: total.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
    setLoanResults(results);

    if (userId) {
      saveCalculation(userId, 'loan', {
        loan_amount: Number(loanAmount),
        annual_interest_rate: Number(interestRate),
        loan_term_years: Number(loanTerm)
      });
    }
  };

  const calculateInvestment = () => {
    if (!initialInvestment || initialInvestment < 0) {
      alert('Please enter a valid initial investment amount');
      return;
    }
    if (!monthlyContribution || monthlyContribution < 0) {
      alert('Please enter a valid monthly contribution');
      return;
    }
    if (!annualReturn || annualReturn <= 0 || annualReturn > 100) {
      alert('Please enter a valid annual return between 0 and 100');
      return;
    }
    if (!investmentPeriod || investmentPeriod <= 0) {
      alert('Please enter a valid investment period greater than 0');
      return;
    }
    const r = annualReturn / 100 / 12;
    const n = investmentPeriod * 12;
    const futureValue = initialInvestment * Math.pow(1 + r, n) +
      monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const totalContributions = initialInvestment + monthlyContribution * n;
    const totalEarnings = futureValue - totalContributions;
    const results = {
      futureValue: futureValue.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalEarnings: totalEarnings.toFixed(2),
    };
    setInvestmentResults(results);

    if (userId) {
      saveCalculation(userId, 'investment', {
        initial_amount: Number(initialInvestment),
        annual_interest_rate: Number(annualReturn),
        years: Number(investmentPeriod),
        monthly_contribution: Number(monthlyContribution)
      });
    }
  };

  const calculateSavings = () => {
    if (!currentSavings || currentSavings < 0) {
      alert('Please enter a valid current savings amount');
      return;
    }
    if (!monthlyDeposit || monthlyDeposit <= 0) {
      alert('Please enter a valid monthly deposit greater than 0');
      return;
    }
    if (!savingsRate || savingsRate <= 0 || savingsRate > 100) {
      alert('Please enter a valid interest rate between 0 and 100');
      return;
    }
    if (!savingsGoal || savingsGoal <= 0) {
      alert('Please enter a valid savings goal greater than 0');
      return;
    }
    if (Number(currentSavings) >= Number(savingsGoal)) {
      alert('You have already reached your savings goal!');
      return;
    }
    const r = savingsRate / 100 / 12;
    let balance = Number(currentSavings);
    let months = 0;
    let totalDeposited = Number(currentSavings);
    while (balance < savingsGoal && months < 1200) {
      balance = balance * (1 + r) + Number(monthlyDeposit);
      totalDeposited += Number(monthlyDeposit);
      months++;
    }
    const interestEarned = balance - totalDeposited;
    const results = {
      months: months,
      years: (months / 12).toFixed(1),
      totalDeposited: totalDeposited.toFixed(2),
      interestEarned: interestEarned.toFixed(2),
    };
    setSavingsResults(results);

    if (userId) {
      saveCalculation(userId, 'savings', {
        savings_goal: Number(savingsGoal),
        current_savings: Number(currentSavings),
        monthly_contribution: Number(monthlyDeposit),
        annual_interest_rate: Number(savingsRate)
      });
    }
  };

  const calculateInsurance = () => {
    if (!age || age <= 0 || age > 120) {
      alert('Please enter a valid age');
      return;
    }
    if (!coverageAmount || coverageAmount <= 0) {
      alert('Please enter a valid coverage amount');
      return;
    }
    const baseRates = { term: 0.0003, whole: 0.001, health: 0.002, auto: 0.0015 };
    const healthMultipliers = { excellent: 0.8, good: 1.0, fair: 1.3, poor: 1.7 };
    const ageFactor = 1 + (age - 25) * 0.03;
    const base = coverageAmount * baseRates[insuranceType];
    const monthly = base * ageFactor * healthMultipliers[healthStatus];
    const results = {
      monthlyPremium: monthly.toFixed(2),
      annualPremium: (monthly * 12).toFixed(2),
      coverageAmount: Number(coverageAmount).toLocaleString(),
    };
    setInsuranceResults(results);

    if (userId) {
      saveCalculation(userId, 'insurance', {
        age: Number(age),
        coverage_amount: Number(coverageAmount),
        term_years: 1
      });
    }
  };

  return (
    <div className="tools-page">
      <Navbar />
      <div className="tools-container">
        <div className="tabs">
          {['Loan', 'Investment', 'Savings', 'Insurance'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Loan' && (
          <div className="calculator">
            <h2>Loan & Mortgage Calculator</h2>
            <p>Calculate monthly payments, total interest, and overall loan cost</p>
            <label>Loan Amount ($)</label>
            <input type="number" value={loanAmount}
              onChange={e => setLoanAmount(e.target.value)} />
            <label>Annual Interest Rate (%)</label>
            <input type="number" value={interestRate}
              onChange={e => setInterestRate(e.target.value)} />
            <label>Loan Term (years)</label>
            <input type="number" value={loanTerm}
              onChange={e => setLoanTerm(e.target.value)} />
            <div className="btn-row">
              <button className="calculate-btn" onClick={calculateLoan}>Calculate</button>
              <button className="reset-btn" onClick={() => setLoanResults(null)}>Reset</button>
            </div>
            {loanResults && (
              <div className="results">
                <div className="result-item">
                  <p>Monthly Payment</p>
                  <p>${loanResults.monthly}</p>
                </div>
                <div className="result-item">
                  <p>Total Payment</p>
                  <p>${loanResults.total}</p>
                </div>
                <div className="result-item">
                  <p>Total Interest</p>
                  <p>${loanResults.totalInterest}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Investment' && (
          <div className="calculator">
            <h2>Investment Growth Calculator</h2>
            <p>Project your investment returns with compound interest</p>
            <label>Initial Investment ($)</label>
            <input type="number" value={initialInvestment}
              onChange={e => setInitialInvestment(e.target.value)} />
            <label>Monthly Contribution ($)</label>
            <input type="number" value={monthlyContribution}
              onChange={e => setMonthlyContribution(e.target.value)} />
            <label>Expected Annual Return (%)</label>
            <input type="number" value={annualReturn}
              onChange={e => setAnnualReturn(e.target.value)} />
            <label>Investment Period (years)</label>
            <input type="number" value={investmentPeriod}
              onChange={e => setInvestmentPeriod(e.target.value)} />
            <div className="btn-row">
              <button className="calculate-btn" onClick={calculateInvestment}>Calculate</button>
              <button className="reset-btn" onClick={() => setInvestmentResults(null)}>Reset</button>
            </div>
            {investmentResults && (
              <div className="results">
                <div className="result-item">
                  <p>Future Value</p>
                  <p>${investmentResults.futureValue}</p>
                </div>
                <div className="result-item">
                  <p>Total Contributions</p>
                  <p>${investmentResults.totalContributions}</p>
                </div>
                <div className="result-item">
                  <p>Total Earnings</p>
                  <p className="earnings">${investmentResults.totalEarnings}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Savings' && (
          <div className="calculator">
            <h2>Savings Goal Calculator</h2>
            <p>Calculate how long it will take to reach your savings goal</p>
            <label>Current Savings ($)</label>
            <input type="number" value={currentSavings}
              onChange={e => setCurrentSavings(e.target.value)} />
            <label>Monthly Deposit ($)</label>
            <input type="number" value={monthlyDeposit}
              onChange={e => setMonthlyDeposit(e.target.value)} />
            <label>Annual Interest Rate (%)</label>
            <input type="number" value={savingsRate}
              onChange={e => setSavingsRate(e.target.value)} />
            <label>Savings Goal ($)</label>
            <input type="number" value={savingsGoal}
              onChange={e => setSavingsGoal(e.target.value)} />
            <div className="btn-row">
              <button className="calculate-btn" onClick={calculateSavings}>Calculate</button>
              <button className="reset-btn" onClick={() => setSavingsResults(null)}>Reset</button>
            </div>
            {savingsResults && (
              <div className="results">
                <div className="result-item">
                  <p>Months to Goal</p>
                  <p>{savingsResults.months} months</p>
                </div>
                <div className="result-item">
                  <p>Years to Goal</p>
                  <p>{savingsResults.years} years</p>
                </div>
                <div className="result-item">
                  <p>Total Deposited</p>
                  <p>${savingsResults.totalDeposited}</p>
                </div>
                <div className="result-item">
                  <p>Interest Earned</p>
                  <p className="earnings">${savingsResults.interestEarned}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Insurance' && (
          <div className="calculator">
            <h2>Insurance Premium Estimator</h2>
            <p>Estimate your monthly insurance premium based on your profile</p>
            <label>Age</label>
            <input type="number" value={age}
              onChange={e => setAge(e.target.value)} />
            <label>Coverage Amount ($)</label>
            <input type="number" value={coverageAmount}
              onChange={e => setCoverageAmount(e.target.value)} />
            <label>Insurance Type</label>
            <select value={insuranceType} onChange={e => setInsuranceType(e.target.value)}
              className="insurance-select">
              <option value="term">Term Life</option>
              <option value="whole">Whole Life</option>
              <option value="health">Health</option>
              <option value="auto">Auto</option>
            </select>
            <label>Health Status</label>
            <select value={healthStatus} onChange={e => setHealthStatus(e.target.value)}
              className="insurance-select">
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            <div className="btn-row">
              <button className="calculate-btn" onClick={calculateInsurance}>Calculate</button>
              <button className="reset-btn" onClick={() => setInsuranceResults(null)}>Reset</button>
            </div>
            {insuranceResults && (
              <div className="results">
                <div className="result-item">
                  <p>Estimated Monthly Premium</p>
                  <p>${insuranceResults.monthlyPremium}</p>
                </div>
                <div className="result-item">
                  <p>Annual Premium</p>
                  <p>${insuranceResults.annualPremium}</p>
                </div>
                <div className="result-item">
                  <p>Coverage Amount</p>
                  <p>${insuranceResults.coverageAmount}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tools;