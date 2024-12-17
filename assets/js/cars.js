// Initialize Supabase client
const SUPABASE_URL = "http://88.218.170.25:8000";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const carBrandSelect = document.getElementById("car-brand");
const brandHistory = document.getElementById("brand-history");
const priceTableBody = document.querySelector("#price-table tbody");
const carModelSelect = document.querySelector("#car-model")
const car_info = document.querySelector("#car_info");
const car_image = document.querySelector(".image");

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

function set_car_info(car) {
    const name_block = car_info.querySelector('.car_info__name')
    name_block.innerHTML = car.name;
    
    const brand_block = car_info.querySelector('.car_info__brand')
    brand_block.innerHTML = car.brand;

    const realese_block = car_info.querySelector('.car_info__realese')
    realese_block.innerHTML = car.realese_date;

    const price_block = car_info.querySelector('.car_info__price')
    price_block.innerHTML = car.price;

    const description_block = car_info.querySelector('.car_info__description')
    description_block.innerHTML = car.description;
}

async function fetchCarInfo(name) {
    try {
        const { data, error } = await supabaseClient
            .from("cars")
            .select("*")
            .eq("name", name);

        if (error) throw error;

        const car = data[0];
        set_car_info(car)

    } catch (error) {
        console.error("Error fetching car models:", error);
    }
}

async function fetchAndPopulateTable(brand) {
    try {
        let query = supabaseClient.from("cars").select("name, realese_date, price");

        if (brand) {
            query = query.eq("brand", brand); // Добавляем фильтрацию по бренду
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        const tableBody = document.querySelector('#price-table tbody');
        tableBody.innerHTML = ''; 

        if (data && data.length > 0) {
            data.forEach(row => {
                const tr = document.createElement('tr');
                const tdModel = document.createElement('td');
                tdModel.textContent = row.name;

                const tdReleaseDate = document.createElement('td');
                tdReleaseDate.textContent = row.realese_date;

                const tdPrice = document.createElement('td');
                tdPrice.textContent = row.price;

                tr.appendChild(tdModel);
                tr.appendChild(tdReleaseDate);
                tr.appendChild(tdPrice);
                tableBody.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = 'No cars available.';
            tr.appendChild(td);
            tableBody.appendChild(tr);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchBrandsAndImageHistory(brand) {
    if (brand) {
        try {
            const {data, error} = await supabaseClient.from("brands").select("history, link").eq('brand', brand);
            if (error) {
                throw new Error(error.message);
            }
            brandHistory.innerHTML = data[0]['history']; 
            car_image.style.display = 'block';
            car_image.src = data[0]['link'];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        brandHistory.innerHTML = "Select a brand to see its history."; 
    }

}

carBrandSelect.addEventListener("change", (event) => {
    const selectedBrand = event.target.value;
    
    if (selectedBrand) {
        carModelSelect.style.display = "inline-block";
        fetchCarModels(selectedBrand); 
        fetchAndPopulateTable(selectedBrand);
        fetchBrandsAndImageHistory(selectedBrand);
    } else {
        carModelSelect.style.display = "none";
        carModelSelect.innerHTML = '<option value="">-- Choose a Model --</option>';
        car_info.style.display = "none";
        car_image.style.display = "none";
        fetchAndPopulateTable();
        fetchBrandsAndImageHistory();
    }
});

carModelSelect.addEventListener("change", (event) => {
    const selectedModel = event.target.value;
    
    if (selectedModel) {
        car_info.style.display = "block";
        fetchCarInfo(selectedModel); 
    } else {
        car_info.style.display = "none";
        set_car_info({name: '', model: '', realese_date: '', description: '', brand: '', price: ''})
    }
});


fetchCarBrands();
fetchAndPopulateTable();