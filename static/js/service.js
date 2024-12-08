const servicesData = {
    service1: {
      employees: [
        { name: "Иван Иванов", position: "Менеджер", experience: 5 },
        { name: "Мария Петрова", position: "Техник", experience: 3 },
        { name: "Сергей Кузнецов", position: "Аналитик", experience: 7 }
      ],
      profit: [10, 20, 30, 40, 50]
    },
    service2: {
      employees: [
        { name: "Алексей Смирнов", position: "Дизайнер", experience: 4 },
        { name: "Елена Васильева", position: "Разработчик", experience: 6 },
        { name: "Дмитрий Иванов", position: "Тестировщик", experience: 2 }
      ],
      profit: [15, 25, 35, 45, 55]
    },
    service3: {
      employees: [
        { name: "Светлана Николаева", position: "Маркетолог", experience: 3 },
        { name: "Петр Сидоров", position: "Менеджер", experience: 5 },
        { name: "Анна Степанова", position: "Консультант", experience: 4 }
      ],
      profit: [20, 30, 40, 50, 60]
    }
  };
  
  // Функция для обновления статистики на основе выбранного сервиса
  function updateStatistics() {
    const selectedService = document.getElementById("serviceSelect").value;
    const data = servicesData[selectedService];
  
    // Обновляем таблицу сотрудников
    const tableBody = document.getElementById("employeeTable").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Очищаем таблицу
  
    data.employees.forEach(employee => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.experience}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Обновляем гистограмму прибыли
    const chartDiv = document.getElementById("profitChart");
    chartDiv.innerHTML = ""; // Очищаем гистограмму
  
    data.profit.forEach((profit, index) => {
      const bar = document.createElement("div");
      bar.style.height = `${profit}px`;
      bar.className = "bar";
      bar.style.backgroundColor = `rgb(${Math.min(255, profit * 5)}, ${100}, ${150})`;
      bar.textContent = `${profit}`;
      chartDiv.appendChild(bar);
    });
  }
  
  // Инициализация статистики при загрузке страницы
  window.onload = updateStatistics;