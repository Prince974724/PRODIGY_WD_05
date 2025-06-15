(() => {
  const apiKey = "0eefbb341a67559149826ae1ea990962";

  const locationForm = document.getElementById('location-form');
  const locationInput = document.getElementById('location-input');
  const weatherInfo = document.getElementById('weather-info');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
  }

  function mpsToKmh(mps) {
    return (mps * 3.6).toFixed(1);
  }

  function createWeatherHTML(data) {
    if (!data || (data.cod && data.cod !== 200)) {
      return `<p style="color:#f87171;">Location not found or error fetching data.</p>`;
    }

    const iconUrl = data.weather && data.weather[0] && data.weather[0].icon
      ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      : "https://placehold.co/48x48?text=?&bg=rgba(255,255,255,0.3)&fc=000000";

    return `
      <div class="location" tabindex="0">${data.name}, ${data.sys.country}</div>
      <div class="temp" tabindex="0">${kelvinToCelsius(data.main.temp)}°C</div>
      <div class="condition" tabindex="0">
        <img src="${iconUrl}" alt="${data.weather[0].description} weather icon" width="48" height="48" />
        <span>${data.weather[0].description}</span>
      </div>
      <div class="extra-info" role="list" aria-label="Additional weather details">
        <div class="info-item" role="listitem">
          <span>Humidity</span>
          <strong>${data.main.humidity}%</strong>
        </div>
        <div class="info-item" role="listitem">
          <span>Wind Speed</span>
          <strong>${mpsToKmh(data.wind.speed)} km/h</strong>
        </div>
        <div class="info-item" role="listitem">
          <span>Pressure</span>
          <strong>${data.main.pressure} hPa</strong>
        </div>
      </div>
    `;
  }

  async function fetchWeatherByCoords(lat, lon) {
    weatherInfo.innerHTML = '<p>Loading weather data...</p>';
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
      const data = await response.json();
      weatherInfo.innerHTML = createWeatherHTML(data);
    } catch (error) {
      weatherInfo.innerHTML = `<p style="color:#f87171;">Error loading weather data.</p>`;
    }
  }

  async function fetchWeatherByLocation(location) {
    if (!location.trim()) {
      weatherInfo.innerHTML = `<p style="color:#f87171;">Please enter a valid location.</p>`;
      return;
    }
    weatherInfo.innerHTML = '<p>Loading weather data...</p>';
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}`);
      const data = await response.json();
      weatherInfo.innerHTML = createWeatherHTML(data);
    } catch (error) {
      weatherInfo.innerHTML = `<p style="color:#f87171;">Error loading weather data.</p>`;
    }
  }

  // On form submit
  locationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    fetchWeatherByLocation(locationInput.value);
    locationInput.blur();
  });

  // Geolocation on load
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        weatherInfo.innerHTML = `<p>Geolocation unavailable. Please enter a location above.</p>`;
      }
    );
  } else {
    weatherInfo.innerHTML = `<p>Geolocation not supported. Please enter a location above.</p>`;
  }

  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', () => {
    const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('show');
  });

})();
