let userId = localStorage.getItem("userId")

if (!userId) {
  userId = "user_" + Math.random().toString(36).substring(2)
  localStorage.setItem("userId", userId)
}





async function loadTransactions() {

  try {

    const res = await fetch(`/api/transactions?userId=${userId}`)

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

      // safer formatting
      const type = t.type || "unknown"
      const description = t.description || ""
      const amount = Number(t.amount) || 0

      li.innerText = `${type} - ${description} - ₦${amount}`

      list.appendChild(li)

      if (type === "income") {
        income += amount
      }

      if (type === "expense") {
        expense += amount
      }

    })

    // check elements before updating
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
ADD TRANSACTION (IMPROVED)
------------------------- */

window.addTransaction = async function () {

  console.log("Button clicked")

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

    await fetch("/api/add-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        description: description.value,
        amount: amount.value,
        type: type.value,
        userId   // 🔥 ADDED
      })
    })

    loadTransactions()

    // clear inputs
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

  const goal = goalInput.value

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

  /* -------------------------
  RANDOM TIP
  ------------------------- */

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

  /* -------------------------
  LOAD DATA ON START
  ------------------------- */

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

  if (chart) {
    chart.destroy()
  }

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


function downloadTransactions(){
fetch(`/api/transactions?userId=${userId}`)
fetch("/api/transactions")
.then(res => res.json())
.then(data => {

if(!Array.isArray(data)) return alert("No data to download")


// CSV Header
let csv = "Type,Description,Amount,Date\n"
data.forEach(t => {
csv += `${t.type},${t.description},${t.amount},${new Date(t.date).toLocaleString()}\n`
})



// Add rows
data.forEach(t => {
csv += `${t.type},${t.description},${t.amount},${new Date(t.date).toLocaleString()}\n`
})

// Create file
const blob = new Blob([csv], { type: "text/csv" })
const url = window.URL.createObjectURL(blob)

// Create download link
const a = document.createElement("a")
a.href = url
a.download = "tradesave-transactions.csv"

document.body.appendChild(a)
a.click()
document.body.removeChild(a)

})

.catch(err => {
console.error(err)
alert("Download failed")
})

}