from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from database import models, schemas
from database.database import get_db

router = APIRouter(prefix="/tools", tags=["Tools"])

# --- LOAN CALCULATOR ---
@router.post("/loan")
def calculate_loan(
    request: schemas.LoanCalculationRequest,
    db: Session = Depends(get_db)
):
    # Calculate monthly payment
    monthly_rate = request.annual_interest_rate / 100 / 12
    n_payments = request.loan_term_years * 12

    if monthly_rate == 0:
        monthly_payment = request.loan_amount / n_payments
    else:
        monthly_payment = request.loan_amount * (monthly_rate * (1 + monthly_rate) ** n_payments) / ((1 + monthly_rate) ** n_payments - 1)

    total_payment = monthly_payment * n_payments
    total_interest = total_payment - request.loan_amount

    results = {
        "monthly_payment": round(monthly_payment, 2),
        "total_payment": round(total_payment, 2),
        "total_interest": round(total_interest, 2)
    }

    # Save to database
    db_calc = models.ToolCalculation(
        user_id=request.user_id,
        tool_type="loan",
        inputs=request.json(exclude={"user_id"}),
        results=json.dumps(results),
        created_at=str(__import__('datetime').datetime.now())
    )
    db.add(db_calc)
    db.commit()

    return results

# --- Investment calculator ---
@router.post("/investment")
def calculate_investment(
    request: schemas.InvestmentCalculationRequest,
    db: Session = Depends(get_db)
):
    monthly_rate = request.annual_interest_rate / 100 / 12
    n_payments = request.years * 12

    future_value = request.initial_amount * (1 + monthly_rate) ** n_payments
    future_value += request.monthly_contribution * (((1 + monthly_rate) ** n_payments - 1) / monthly_rate)

    results = {
        "future_value": round(future_value, 2),
        "total_contributed": round(request.initial_amount + (request.monthly_contribution * n_payments), 2),
        "total_interest_earned": round(future_value - request.initial_amount - (request.monthly_contribution * n_payments), 2)
    }

    # Save to database
    db_calc = models.ToolCalculation(
        user_id=request.user_id,
        tool_type="investment",
        inputs=request.json(exclude={"user_id"}),
        results=json.dumps(results),
        created_at=str(__import__('datetime').datetime.now())
    )
    db.add(db_calc)
    db.commit()

    return results

# --- Savings calculator ---
@router.post("/savings")
def calculate_savings(
    request: schemas.SavingsCalculationRequest,
    db: Session = Depends(get_db)
):
    monthly_rate = request.annual_interest_rate / 100 / 12
    months = 0
    current = request.current_savings

    while current < request.savings_goal and months < 1200:
        current = current * (1 + monthly_rate) + request.monthly_contribution
        months += 1

    results = {
        "months_to_goal": months,
        "years_to_goal": round(months / 12, 1),
        "final_amount": round(current, 2)
    }

    # Save to database
    db_calc = models.ToolCalculation(
        user_id=request.user_id,
        tool_type="savings",
        inputs=request.json(exclude={"user_id"}),
        results=json.dumps(results),
        created_at=str(__import__('datetime').datetime.now())
    )
    db.add(db_calc)
    db.commit()

    return results

# --- Insurance calculator ---
@router.post("/insurance")
def calculate_insurance(
    request: schemas.InsuranceCalculationRequest,
    db: Session = Depends(get_db)
):
    # Basic insurance estimate formula
    base_rate = 0.001
    age_factor = 1 + (request.age - 25) * 0.03
    monthly_premium = (request.coverage_amount * base_rate * age_factor) / 12

    results = {
        "monthly_premium": round(monthly_premium, 2),
        "annual_premium": round(monthly_premium * 12, 2),
        "total_cost": round(monthly_premium * 12 * request.term_years, 2)
    }

    # Save to database
    db_calc = models.ToolCalculation(
        user_id=request.user_id,
        tool_type="insurance",
        inputs=request.json(exclude={"user_id"}),
        results=json.dumps(results),
        created_at=str(__import__('datetime').datetime.now())
    )
    db.add(db_calc)
    db.commit()

    return results

# --- Get user calculation history ---
@router.get("/{user_id}/history", response_model=List[schemas.ToolCalculation])
def get_calculation_history(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = db.query(models.ToolCalculation).filter(models.ToolCalculation.user_id == user_id).all()
    return history