// Initialize Supabase client
const SUPABASE_URL = "http://88.218.170.25:8000";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const carBrandSelect = document.getElementById("car-brand");
const brandHistory = document.getElementById("brand-history");
const priceTableBody = document.querySelector("#price-table tbody");
const carModelSelect = document.querySelector("#car-model")
const car_info = document.querySelector(".car-info");

// Fetch and populate car brands
async function fetchCarBrands() {
    try {
        const { data, error } = await supabaseClient
            .from("brands")
            .select("brand, history");

        if (error) throw error;

        carBrandSelect.innerHTML = '<option value="">-- Choose a Brand --</option>';
        data.forEach(elem => {
            const option = document.createElement("option");
            option.value = elem.brand;
            option.textContent = elem.brand;
            carBrandSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching car brands:", error);
    }
}

async function fetchCarModels(brand) {
    try {
        const { data, error } = await supabaseClient
            .from("cars")
            .select("name")
            .eq("brand", brand);

        if (error) throw error;

        carModelSelect.innerHTML = '<option value="">-- Choose a Model --</option>';
        data.forEach(elem => {
            const option = document.createElement("option");
            option.value = elem.name;
            option.textContent = elem.name;
            carModelSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching car models:", error);
    }
}

async function fetchCarInfo(name) {
    try {
        const { data, error } = await supabaseClient
            .from("cars")
            .select("*")
            .eq("name", name);

        if (error) throw error;

        const car = data[0];
        const name_block = car_info.querySelector('.car_info__name')
        name_block.innerHTML = car.name;
        
        const brand_block = car_info.querySelector('.car_info__brand')
        brand_block.innerHTML = car.brand;

        const realese_block = car_info.querySelector('.car_info__realese')
        realese_block.innerHTML = car.brand;

        const price_block = car_info.querySelector('.car_info__price')
        price_block.innerHTML = car.price;

        const description_block = car_info.querySelector('.car_info__description')
        description_block.innerHTML = car.brand;

    } catch (error) {
        console.error("Error fetching car models:", error);
    }
}

carBrandSelect.addEventListener("change", (event) => {
    const selectedBrand = event.target.value;
    
    if (selectedBrand) {
        carModelSelect.style.display = "inline-block";
        fetchCarModels(selectedBrand); 
    } else {
        carModelSelect.innerHTML = '<option value="">-- Choose a Model --</option>';
    }
});

carModelSelect.addEventListener("change", (event) => {
    const selectedModel = event.target.value;
    
    if (selectedModel) {
        carModelSelect.style.display = "block";
        fetchCarInfo(selectedModel); 
    } else {
        // carModelSelect.innerHTML = '<option value="">-- Choose a Model --</option>';
    }
});


fetchCarBrands();