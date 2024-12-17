const SUPABASE_URL = "http://88.218.170.25:8000";  // Адрес Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";  // Ваш ключ доступа
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const service_table = document.querySelector("#service-table");
const brands_table = document.querySelector("#brands-table");


async function fetchBrands() {
    const { data, error } = await supabaseClient
    .from("brands")  // Таблица с сервисами
    .select("brand, description");
    let tableBody = brands_table.querySelector('tbody');
    if (error) throw error;
    if (data && data.length > 0) {
        data.forEach(row => {
            const tr = document.createElement('tr');
            const tdbrand = document.createElement('td');
            tdbrand.textContent = row.brand;

            const tdescription = document.createElement('td');
            tdescription.textContent = row.description;

            tr.appendChild(tdbrand);
            tr.appendChild(tdescription);
            tableBody.appendChild(tr);
        });
    }
}

async function fetchServices() {
    const { data, error } = await supabaseClient
    .from("service")  // Таблица с сервисами
    .select("name, description");
    let tableBody = service_table.querySelector('tbody');
    if (error) throw error;
    if (data && data.length > 0) {
        data.forEach(row => {
            const tr = document.createElement('tr');
            const tdname = document.createElement('td');
            tdname.textContent = row.name;

            const tdescription = document.createElement('td');
            tdescription.textContent = row.description;

            tr.appendChild(tdname);
            tr.appendChild(tdescription);
            tableBody.appendChild(tr);
        });
    }

}



fetchBrands();
fetchServices();