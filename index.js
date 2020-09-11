const url =
  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

  const punto1 = (data) => {
  let tableBodyPunto1 = document
    .getElementById("punto1")
    .getElementsByTagName("tbody")[0];
  data.forEach((element, index) => {
    let row = document.createElement("tr");
    if (element.squirrel) row.classList.add('table-danger');
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(`${index + 1}`));
    let events = document.createElement("td");
    events.appendChild(document.createTextNode(`${element.events.toString()}`));
    let squirrel = document.createElement("td");
    squirrel.appendChild(document.createTextNode(`${element.squirrel}`));
    row.appendChild(th);
    row.appendChild(events);
    row.appendChild(squirrel);
    tableBodyPunto1.appendChild(row);
  });
};

const punto2 = (data) => {
  let setUniqueValues = uniqueValues(data);
  setValuesForCorrelations(data, setUniqueValues);
  let correlationArray = setUniqueValues.map(calculateCorrelation)
    .sort((a, b)=>b.correlation - a.correlation);
  let tableBodyPunto2 = document
    .getElementById("punto2")
    .getElementsByTagName("tbody")[0];
  correlationArray.forEach((element, index) => {
    let row = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(`${index + 1}`));
    let events = document.createElement("td");
    events.appendChild(document.createTextNode(`${element.event}`));
    let correlation = document.createElement("td");
    correlation.appendChild(document.createTextNode(`${element.correlation}`));
    row.appendChild(th);
    row.appendChild(events);
    row.appendChild(correlation);
    tableBodyPunto2.appendChild(row);
  });
};

const uniqueValues = (data) => {
  return data.reduce((acc, val) => {
    val.events.forEach((event) => {
      let current = acc.filter((element) => element.event === event).pop() || {
        event: event,
        values: [0, 0, 0, 0],
      };
      let index = acc.indexOf(current);
      if (index === -1) acc.push(current);
    });
    return acc;
  }, []);
};

const setValuesForCorrelations = (data, setUniqueValues) => {
  data.forEach((element) => {
    let squirrel = element.squirrel;
    setUniqueValues.forEach((tuple) => {
      if (element.events.indexOf(tuple.event) === -1) {
        if (squirrel) tuple.values[2] += 1;
        else tuple.values[0] += 1;
      } else {
        if (squirrel) tuple.values[3] += 1;
        else tuple.values[1] += 1;
      }
    });
  });
};

const calculateCorrelation = (data) => {
  let TN = data.values[0];
  let FN = data.values[1];
  let FP = data.values[2];
  let TP = data.values[3];
  let correlation =
    (TP * TN - FP * FN) /
    Math.sqrt((TP + FP) * (TP + FN) * (TN + FP) * (TN + FN));
  return { event: data.event, correlation };
};

fetch(url)
  .then((response) => response.json())
  .then((response) => {
    punto1(response);
    punto2(response);
  });
