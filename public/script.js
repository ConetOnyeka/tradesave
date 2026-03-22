async function loadTransactions() {

  try {

    const res = await fetch("/api/transactions")

    if (!res.ok) {
      console.error("Failed to fetch transactions")
      return
    }

    const data = await res.json()

    const list = document.getElementById("list")
    if (!list) return

    list.innerHTML = ""

    let income = 0
    let expense = 0

    data.forEach(t => {

      const li = document.createElement("li")

      const type = t.type || "unknown"
      const description = t.description || ""
      const amount = Number(t.amount) || 0

      li.innerText = `${type} - ${description} - ₦${amount}`

      list.appendChild(li)

      if (type === "income") income += amount
      if (type === "expense") expense += amount

    })

    const incomeEl = document.getElementById("income")
    const expenseEl = document.getElementById("expense")
    const profitEl = document.getElementById("profit")

    if (incomeEl) incomeEl.innerText = income
    if (expenseEl) expenseEl.innerText = expense
    if (profitEl) profitEl.innerText = income - expense

    updateScore(income)
    drawChart(income, expense)

  } catch (err) {
    console.error("Error loading transactions:", err)
  }
}


/* -------------------------
ADD TRANSACTION (FINAL FIX)
------------------------- */

window.addTransaction = async function () {

  const description = document.getElementById("description")
  const amount = document.getElementById("amount")
  const type = document.getElementById("type")

  if (!description || !amount || !type) {
    console.error("Missing input fields")
    return
  }

  if (!description.value || !amount.value) {
    alert("Please fill all fields")
    return
  }

  try {

    const res = await fetch("/api/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: description.value,
        amount: Number(amount.value), // ✅ FIXED
        type: type.value
      })
    })

    if (!res.ok) {
      console.error("Failed to add transaction")
      return
    }

    loadTransactions()

    description.value = ""
    amount.value = ""

  } catch (err) {
    console.error("Error adding transaction:", err)
  }
}


/* -------------------------
SET GOAL
------------------------- */

function setGoal() {

  const goalInput = document.getElementById("goal")
  if (!goalInput) return

  const goal = Number(goalInput.value) || 0

  localStorage.setItem("goal", goal)

  const goalAmount = document.getElementById("goalAmount")
  if (goalAmount) goalAmount.innerText = goal
}


/* -------------------------
LOAD SAVED GOAL
------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  const goalAmount = document.getElementById("goalAmount")
  if (goalAmount) {
    goalAmount.innerText = localStorage.getItem("goal") || 0
  }

  const tips = [
    "Save at least 10% of your daily profit.",
    "Separate business money from personal money.",
    "Record every sale and expense.",
    "Restock only fast selling products.",
    "Avoid unnecessary borrowing.",
    "Stop spending more than your income."
  ]

  const tipEl = document.getElementById("tip")
  if (tipEl) {
    tipEl.innerText = tips[Math.floor(Math.random() * tips.length)]
  }

  loadTransactions()
})


/* -------------------------
UPDATE SCORE
------------------------- */

function updateScore(income) {

  let score = 0

  if (income > 10000) score = 50
  if (income > 50000) score = 70
  if (income > 100000) score = 90

  const scoreEl = document.getElementById("score")
  if (scoreEl) scoreEl.innerText = score
}


/* -------------------------
CHART
------------------------- */

let chart

function drawChart(income, expense) {

  const ctx = document.getElementById("financeChart")
  if (!ctx) return

  const chartCtx = ctx.getContext("2d")

  if (chart) chart.destroy()

  chart = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Financial Overview",
        data: [income, expense]
      }]
    }
  })
}


/* -------------------------
NAVIGATION
------------------------- */

function openDashboard() {
  window.location.href = "dashboard.html"
}