async function loadTransactions(){

  try {

    const res = await fetch("/api/transactions")

    if(!res.ok){
      console.error("Failed to fetch transactions")
      return
    }

    const data = await res.json()

    const list = document.getElementById("list")

    list.innerHTML = ""

    let income = 0
    let expense = 0

    data.forEach(t => {

      const li = document.createElement("li")
      li.innerText = `${t.type} - ${t.description} - ₦${t.amount}`

      list.appendChild(li)

      if(t.type === "income"){
        income += Number(t.amount)
      }

      if(t.type === "expense"){
        expense += Number(t.amount)
      }

    })

    document.getElementById("income").innerText = income
    document.getElementById("expense").innerText = expense
    document.getElementById("profit").innerText = income - expense

    updateScore(income)
    drawChart(income, expense)

  } catch (err) {
    console.error("Error loading transactions:", err)
  }
}


/* -------------------------
ADD TRANSACTION (FIXED)
------------------------- */

window.addTransaction = async function () {

  console.log("Button clicked")

  const description = document.getElementById("description").value
  const amount = document.getElementById("amount").value
  const type = document.getElementById("type").value

  if(!description || !amount){
    alert("Please fill all fields")
    return
  }

  await fetch("/api/add-transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      description,
      amount,
      type
    })
  })

  loadTransactions()

  // clear inputs
  document.getElementById("description").value = ""
  document.getElementById("amount").value = ""
}


/* -------------------------
SET GOAL
------------------------- */

function setGoal(){

  const goal = document.getElementById("goal").value

  localStorage.setItem("goal", goal)

  document.getElementById("goalAmount").innerText = goal
}


/* -------------------------
LOAD SAVED GOAL
------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("goalAmount").innerText =
    localStorage.getItem("goal") || 0

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

  document.getElementById("tip").innerText =
    tips[Math.floor(Math.random() * tips.length)]

  /* -------------------------
  LOAD DATA ON START
  ------------------------- */

  loadTransactions()
})


/* -------------------------
UPDATE SCORE
------------------------- */

function updateScore(income){

  let score = 0

  if(income > 10000) score = 50
  if(income > 50000) score = 70
  if(income > 100000) score = 90

  document.getElementById("score").innerText = score
}


/* -------------------------
CHART
------------------------- */

let chart;

function drawChart(income, expense){

  const ctx = document.getElementById("financeChart")

  if(!ctx) return

  const chartCtx = ctx.getContext("2d")

  if(chart){
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

function openDashboard() {
  window.location.href = "dashboard.html"
}