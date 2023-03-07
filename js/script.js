let map = undefined;
const mapInitialization = () => {
    navigator.geolocation.getCurrentPosition((val) => {
        map = L.map("ge-map").setView([val.coords.latitude, val.coords.longitude], 3);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        //set up a standalone popup (use a popup as a layer)
        L.marker([val.coords.latitude, val.coords.longitude]).addTo(map).bindPopup("You are here.").openPopup();

        $.ajax({
            url: "./PHP/getCountryCode.php",
            type: "POST",
            dataType: "json",
            data: {
                country_latitude: val.coords.latitude,
                country_longitude: val.coords.longitude,
            },
            success: (result) => {
                if (result.status.name == "ok") {
                    $("#selectedCountry").html(result.data.countryName);
                    getCountryInfo(result.data.countryName);
                    drawCountryBorder(result.data.countryName);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                alert("No Data Found");
            },
        });
    });
};
const getCountryList = () => {
    $.ajax({
        url: "./PHP/getCountryList.php",
        type: "POST",
        dataType: "json",
        data: {
            country_name: $(".countryName").val(),
        },
        success: (result) => {
            // console.log(result.data);
            let countryList = "";
            let countryData = JSON.parse(result.data);
            countryData.forEach((element) => {
                countryList +=
                    "<button class='dropdown-item countryName' onClick='onCountryChange(event)'>" +
                    element +
                    "</button>";
            });

            if (result.status.name == "ok") {
                $("#countryList").html(countryList);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
};
$(window).on("load", () => {
    if ($("#preloader").length) {
        $("#preloader")
            .delay(1000)
            .fadeOut("slow", function () {
                $(this).remove();
            });
    }
    getCountryList();
    mapInitialization();
});
const filterFunction = () => {
    var input, filter, ul, li, button, i;
    input = document.getElementById("searchCountry");
    filter = input.value.toUpperCase();
    div = document.getElementById("dropdowMenu");
    button = div.getElementsByTagName("button");
    for (i = 0; i < button.length; i++) {
        txtValue = button[i].textContent || button[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            button[i].style.display = "";
        } else {
            button[i].style.display = "none";
        }
    }
};

let countryBorder = undefined;
const drawCountryBorder = (countryName) => {
    $.ajax({
        url: "./PHP/getCountryborder.php",
        type: "POST",
        dataType: "json",
        data: {
            country_name: countryName,
        },
        success: (result) => {
            const data = JSON.parse(result.data);
            if (countryBorder) map.removeLayer(countryBorder);
            countryBorder = L.geoJSON(data.geometry, {
                color: "black",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.0,
            });
            map.setView(countryBorder.getBounds().getCenter());
            countryBorder.addTo(map);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
};

const setCountryData = (
    country_name,
    continent_name,
    country_code,
    capital,
    population,
    currency_code,
    temperature,
    area,
    languages
) => {
    $("#name").text(country_name);
    console.log(" " + getFlagEmoji(country_code));
    $("#flag").text(getFlagEmoji(country_code));
    $("#continent").text(continent_name);
    $("#code").text(country_code);
    $("#capital").text(capital);
    $("#population").text(population);
    $("#currency").text(currency_code);
    $("#temperature").text(temperature);
    $("#area").text(area);
    $("#language").text(languages);
};

const getCountryInfo = (countryName) => {
    $.ajax({
        url: "./PHP/getCountryInfo.php",
        type: "POST",
        dataType: "json",
        data: {
            country_name: countryName,
        },
        success: (result) => {
            console.log(result.data);
            if (result.status.name == "ok") {
                setCountryData(
                    result.data.country_name,
                    result.data.continent_name,
                    result.data.country_code,
                    result.data.capital,
                    result.data.population,
                    result.data.currency_code,
                    result.data.temperature,
                    result.data.area,
                    result.data.languages,
                    result.data.wikipedia
                );
                getWikipedia(result.data.wikipedia);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
};

const onCountryChange = (event) => {
    $("#selectedCountry").html(event.target.innerText);
    getCountryInfo(event.target.innerText);
    drawCountryBorder(event.target.innerText);
};

const getWikipedia = (link) => {
    let country_wikipedia = '<a href="' + link + '" target="_blank">' + link + "</a>";
    $("#country_wiki").html(country_wikipedia);
};

const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};
