// Initialize Supabase client
const SUPABASE_URL = "http://88.218.170.25:8000";  // Адрес Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";  // Ваш ключ доступа
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const serviceSelect = document.getElementById("serviceSelect");
const serviceHistory = document.getElementById("service-history");
const serviceTableBody = document.querySelector("#servicesTable tbody");
const profit_hist = document.querySelector("#profit_hist");
const order_hist = document.querySelector("#order_hist");
let charts = [];

async function fetchServices() {
    try {
        const { data, error } = await supabaseClient
            .from("service")  // Таблица с сервисами
            .select("id, name");

        if (error) throw error;

        serviceSelect.innerHTML = '<option value="">-- Выберите сервис --</option>';
        data.forEach(service => {
            const option = document.createElement("option");
            option.value = service.id;
            option.textContent = service.name;
            serviceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}

async function fetchServiceTable() {
    try {
        const { data, error } = await supabaseClient
            .from("service")
            .select("name, address, qty, profits");

        if (error) throw error;

        serviceTableBody.innerHTML = "";
        
        populateServiceTable(data);
    } catch (error) {
        console.error("Error fetching service table:", error);
    }
}

function populateServiceTable(data) {
    data.forEach(service => {
        const row = document.createElement("tr");
        let elem = document.createElement("td")
        elem.innerText = service.name;
        row.appendChild(elem);
        elem = document.createElement("td")
        elem.innerText = service.address;
        row.appendChild(elem);
        elem = document.createElement("td")
        elem.innerText = service.qty.reduce((acc, now_value) => {
            return acc + now_value
            }, 0);
        row.appendChild(elem);
        elem = document.createElement("td")
        elem.innerText = service.profits.reduce((acc, now_value) => {
            return acc + now_value * 1000
            }, 0)
        row.appendChild(elem);

        serviceTableBody.appendChild(row);
    });
}

function draw_hist(data, html_tag) {
    const ctx = html_tag.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Создаем градиент от верхнего к нижнему краю
    gradient.addColorStop(0, 'rgba(244, 162, 235, 1)'); // Цвет на верхнем краю
    gradient.addColorStop(1, 'rgba(54, 162, 235, 1)');  // Цвет на нижнем краю
    charts.push(new Chart(ctx, {
        type: 'bar', // Тип графика - столбчатая гистограмма
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `Месяц ${i + 1}`), // Метки для оси X (например, месяцы)
          datasets: [{
            label: 'Значения',
            data: data, // Массив данных для гистограммы
            backgroundColor: gradient, // Цвет заливки столбцов
            borderColor: 'rgba(54, 162, 235, 1)', // Цвет границ столбцов
            borderWidth: 1
          }]
        },
        options: {
            responsive: true,
        }
      }));
}

function clear_hist() {
    charts.forEach(chart => {chart.destroy();})
    charts = []
}

async function draw_hist_wrapper(serviceId) {
    try {
        const { data, error } = await supabaseClient
            .from("service")  // Таблица с сервисами
            .select("qty, profits")
            .eq('id', serviceId);

        if (error) throw error;
        draw_hist(data[0].qty, order_hist);
        draw_hist(data[0].profits, profit_hist);
        
    } catch (error) {
        console.error("Error fetching services:", error);
    }
}


serviceSelect.addEventListener("change", (event) => {
    const serviceId = event.target.value;
    console.log(serviceId)
    if (serviceId) {
        clear_hist();
        draw_hist_wrapper(serviceId);
    } else {
        clear_hist();
    }
});

// Инициализация данных
fetchServices();
fetchServiceTable();