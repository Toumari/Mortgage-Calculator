const mortgageAmount = document.querySelector("#amount");
const loanYears = document.querySelector("#years");
const interest = document.querySelector("#interest");
const submitBtn = document.querySelector(".calc-button");
const resultPanel = document.querySelector(".results");
const interestOnlyRadio = document.querySelector("#interest-only");
const repaymentsRadio = document.querySelector("#repayment");
const clearBtn = document.querySelector(".clear-btn");
const form = document.querySelector("form");

function formatToPounds(number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(number);
}

function calculateMonthlyPayment(amount, termInYears, interestRate) {
  const monthlyInterestRate = interestRate / 100 / 12;
  return amount * monthlyInterestRate;
}

function calculateTotalPayment(monthlyPayment, totalPayments) {
  return monthlyPayment * totalPayments;
}

function calculateMortgage(amount, term, interest) {
  const monthlyInterestRate = interest / 1200;
  const exponent = Math.pow(1 + monthlyInterestRate, -term * 12);
  const denominator = 1 - exponent;
  const monthlyPayment = (amount * monthlyInterestRate) / denominator;
  const totalAmountPaid = calculateTotalPayment(monthlyPayment, term * 12);

  return {
    monthlyPayment: formatToPounds(monthlyPayment),
    totalAmountPaid: formatToPounds(totalAmountPaid),
  };
}

function calculateInterestOnlyPayment(amount, termInYears, interestRate) {
  const monthlyPayment = calculateMonthlyPayment(
    amount,
    termInYears,
    interestRate
  );
  const totalAmountPaid = calculateTotalPayment(
    monthlyPayment,
    termInYears * 12
  );

  return {
    monthlyPayment: formatToPounds(monthlyPayment),
    totalAmountPaid: formatToPounds(totalAmountPaid),
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    amount.value &&
    loanYears.value &&
    interest.value &&
    (repaymentsRadio.checked || interestOnlyRadio.checked)
  ) {
    resultPanel.style.display = "block";
    resultPanel.style.textAlign = "left";
    resultPanel.style.paddingTop = "1rem";

    const { monthlyPayment, totalAmountPaid } = interestOnlyRadio.checked
      ? calculateInterestOnlyPayment(
          mortgageAmount.value,
          loanYears.value,
          interest.value
        )
      : calculateMortgage(
          mortgageAmount.value,
          loanYears.value,
          interest.value
        );

    resultPanel.innerHTML = `
      <h2 class="result-details-title">Your Results</h2>
      <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click 'calculate repayments' again.</p>
      <div class="result-card">
        <p>Your monthly Repayments</p>
        <h3 class="result-card-figure">${monthlyPayment}</h3>
        <p>Total you'll repay over the term</p>
        <h4 class="result-card-total-paid">${totalAmountPaid}</h4>
      </div>
    `;
  }
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  mortgageAmount.value = undefined;
  loanYears.value = undefined;
  interest.value = undefined;
  repaymentsRadio.checked = false;
  interestOnlyRadio.checked = false;
  resultPanel.style.display = "flex";
  resultPanel.style.textAlign = "center";
  resultPanel.style.paddingTop = "5rem";
  resultPanel.innerHTML = `
    <img
      src="assets/images/illustration-empty.svg"
      alt="Icon Calculator"
    />
    <h2>Results shown here</h2>
    <p>
      Complete the form and click 'calculate repayments' to see what your
      monthly repayments would be.
    </p>
  `;
});
