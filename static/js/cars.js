// Initialize Supabase client
const SUPABASE_URL = "http://88.218.170.25:8000";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const carBrandSelect = document.getElementById("car-brand");
const brandHistory = document.getElementById("brand-history");
const priceTableBody = document.querySelector("#price-table tbody");

// Fetch and populate car brands
async function fetchCarBrands() {
    try {
        const { data, error } = await supabaseClient
            .from("cars")
            .select("brand");

        if (error) throw error;

        unique_brands = [...new Set(data.map(elem => elem.brand))]
        carBrandSelect.innerHTML = '<option value="">-- Choose a Brand --</option>';
        unique_brands.forEach(elem => {
            const option = document.createElement("option");
            option.value = elem;
            option.textContent = elem;
            carBrandSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching car brands:", error);
    }
}

// Fetch and display brand history and car details
async function fetchCarDetails(brand) {
    try {
        const { data: brandData, error: brandError } = await supabaseClient
            .from("car_brands")
            .select("description")
            .eq("name", brand)
            .single();

        if (brandError) throw brandError;

        brandHistory.innerHTML = `
            <h2>${brand}</h2>
            <p>${brandData.description || "No description available."}</p>
        `;

        const { data: carData, error: carError } = await supabaseClient
            .from("cars")
            .select("name, release_date, price")
            .eq("brand", brand);

        if (carError) throw carError;

        priceTableBody.innerHTML = "";
        carData.forEach(car => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${car.name}</td>
                <td>${car.release_date}</td>
                <td>${car.price}</td>
            `;
            priceTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching car details:", error);
        brandHistory.innerHTML = `<p>Error loading brand details.</p>`;
        priceTableBody.innerHTML = `<tr><td colspan="3">Error loading prices.</td></tr>`;
    }
}

// Event Listener for brand selection
// carBrandSelect.addEventListener("change", () => {
//     const selectedBrand = carBrandSelect.value;
//     if (selectedBrand) {
//         fetchCarDetails(selectedBrand);
//     } else {
//         brandHistory.innerHTML = `<p>Select a brand to see its history.</p>`;
//         priceTableBody.innerHTML = `<tr><td colspan="3">Select a brand to view prices.</td></tr>`;
//     }
// });

// Initialize data on page load
fetchCarBrands();