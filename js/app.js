"use strict";

/*
* Page Build
*/

const contentContainer = document.querySelector('#contentContainer');

const infoHeader = document.createElement('h2');
const detail1 = document.createElement('p');
const detail2 = document.createElement('p');
const detail3 = document.createElement('ul');
const errorMessage = document.createElement('p');

contentContainer.appendChild(infoHeader);
contentContainer.appendChild(detail1);
contentContainer.appendChild(detail2);
contentContainer.appendChild(detail3);
contentContainer.appendChild(errorMessage);


/*
* Utility Functions
*/

const clearInfo = () => {
  infoHeader.innerHTML = "";
  detail1.innerHTML = "";
  detail2.innerHTML = "";
  detail3.innerHTML = "";
  errorMessage.innerHTML = "";
};

/*
* XHR
*/

const queryAPI = () => {

  let resourceType = document.querySelector('#resourceType').value;
  let resourceId = document.querySelector('#resourceId').value;
  clearInfo();

  const queryReq = new XMLHttpRequest();

  const queryReqListener = () => {
    if (queryReq.status !== 200) {
      let error = JSON.parse(queryReq.responseText);
      errorMessage.innerHTML = `${queryReq.status}: ${error.detail}`;
      return;
    }
    const resource = JSON.parse(queryReq.responseText);

    if (resourceType == "people") {
      infoHeader.innerHTML = resource.name;
      detail1.innerHTML = resource.gender;

      const speciesReq = new XMLHttpRequest();

      const speciesReqListener = () => {
        const species = JSON.parse(speciesReq.responseText);
        detail2.innerHTML = species.name;
      };

      speciesReq.addEventListener('load', speciesReqListener);
      speciesReq.open('GET', resource.species[0]);
      speciesReq.send();

    } else if (resourceType == "planets") {
      infoHeader.innerHTML = resource.name;
      detail1.innerHTML = resource.terrain;
      detail2.innerHTML = resource.population;
      let films = resource.films;

      films.forEach(film => {
        const filmReq = new XMLHttpRequest();

        const filmReqListener = () => {
          const filmResponse = JSON.parse(filmReq.responseText);
          let filmItem = document.createElement('li');
          filmItem.innerHTML = filmResponse.title;
          detail3.appendChild(filmItem);
        };

        filmReq.addEventListener('load', filmReqListener);
        filmReq.open('GET', film);
        filmReq.send();
      });


    } else if (resourceType == "starships") {
      infoHeader.innerHTML = resource.name;
      detail1.innerHTML = resource.manufacturer;
      detail2.innerHTML = resource.starship_class;

      let films = resource.films;

      films.forEach(film => {
        const filmReq = new XMLHttpRequest();

        const filmReqListener = () => {
          const filmResponse = JSON.parse(filmReq.responseText);
          let filmItem = document.createElement('li');
          filmItem.innerHTML = filmResponse.title;
          detail3.appendChild(filmItem);
        };

        filmReq.addEventListener('load', filmReqListener);
        filmReq.open('GET', film);
        filmReq.send();
      });
    }
  }
};

queryReq.addEventListener('load', queryReqListener);
queryReq.open('GET', `https://swapi.co/api/${resourceType}/${resourceId}/`);
queryReq.send();
};

/*
* Event Listeners
*/
const requestButton = document.querySelector('#requestResourceButton');

requestButton.addEventListener('click', queryAPI);
