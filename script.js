'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const para = document.querySelector('.para');

///////////////////////////////////////

const renderCountry = function (data, className) {
  const countryLanguage = data.languages[Object.keys(data.languages)[0]];
  let countryLanguage2 = data.languages[Object.keys(data.languages)[1]];
  if (!countryLanguage2) {
    countryLanguage2 = 'None';
  }

  const currency = data.currencies[Object.keys(data.currencies)[0]];

  const html = `
        <article class="country ${className}">
        <img class="country__img" src="${data.flags.svg} " />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <h5 class="country__region">${data.capital}</h5>
            <p class="country__row"><span><i class="fas fa-users"></i></span>${(
              +data.population / 1000000
            ).toFixed(1)} Million people</p>
                    <p class="country__row"><span><i class="fas fa-podcast"></i></span>${countryLanguage}, ${countryLanguage2}</p>
            <p class="country__row"><span><i class="fas fa-coins"></i></span>${
              currency.name
            }(${currency.symbol})
            <p class="country__row"><span><i class="fas fa-clock"></i></span>${
              data.timezones[0]
            }
            </p>
        </div>
        </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getJSON = async function (url, errorMessage = `Something Went Wrong`) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${errorMessage}(${response.status})`);
  return response.json();
};

const getCountryAndNeighbour = async function (country) {
  try {
    const data = await getJSON(
      `https://restcountries.com/v3.1/name/${country}`,
      `Country not found`
    );

    renderCountry(data[0]);
    const neighbour = data[0].borders[0];
    if (!neighbour) throw new Error('No Neighbouring Country');
    const dataNeighbour = await getJSON(
      `https://restcountries.com/v3.1/alpha/${neighbour}`,
      `Country not Found`
    );
    renderCountry(dataNeighbour[0], 'neighbour');

    countriesContainer.style.opacity = '1';
  } catch (error) {
    renderError(`Something went wrong ${error.message}. Try Again!`);
  }
};

const whereAmI = async function (lat, lng) {
  try {
    const response = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json`
    );
    if (!response.ok)
      throw new Error(`Problem with geocode API ${response.status}`);

    const data = await response.json();

    getCountryAndNeighbour(data.country);
  } catch (error) {
    window.setTimeout(function () {
      window.location.reload();
    }, 1000);
    console.error(`${error.message}`);
  }
};

const currentLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

btn.addEventListener('click', async function () {
  const position = await currentLocation();

  whereAmI(position.coords.latitude, position.coords.longitude);

  btn.style.display = 'none';
  para.style.display = 'none';
});
