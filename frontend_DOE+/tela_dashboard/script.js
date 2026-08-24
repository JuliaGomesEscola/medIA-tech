document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("kpi1").innerText = "42";
    document.getElementById("kpi2").innerText = "128";
    document.getElementById("kpi3").innerText = "85%";
  

    const ctx = document.getElementById("simpleChart").getContext("2d");
  
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"],
        datasets: [
          {
            label: "Informação a Definir",
            data: [12, 19, 10, 25, 22, 30],
            borderColor: "#e62335", 
            backgroundColor: "rgba(230, 35, 53, 0.08)",
            borderWidth: 3,
            fill: true,
            tension: 0.4, 
            pointBackgroundColor: "#e62335",
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false 
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              color: "#f0f0f0"
            },
            beginAtZero: true
          }
        }
      }
    });
  });