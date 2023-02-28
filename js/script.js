$(window).on("load", () => {
    if ($("#preloader").length) {
        $("#preloader")
            .delay(1000)
            .fadeOut("slow", function () {
                $(this).remove();
            });
    }
});

$("#findNeighbour").click(() => {
    $.ajax({
        url: "PHP/countryNeighbour.php",
        type: "POST",
        dataType: "json",
        data: {
            country_code: $("#countryCode").val(),
        },
        success: (result) => {
            console.log(JSON.stringify(result));
            let neighbours = "";
            result.data.forEach((element) => {
                neighbours += "<li>" + element.asciiName + "</li>";
            });

            console.log(neighbours);

            if (result.status.name == "ok") {
                $("#countryNeighboursListRes").html(neighbours);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
});

$("#findCountryCode").click(() => {
    $.ajax({
        url: "PHP/countryCode.php",
        type: "POST",
        dataType: "json",
        data: {
            country_name: $("#countryName").val(),
        },
        success: (result) => {
            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $("#countryCodeRes").html(result["data"][0]["countryCode"]);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
});

$("#findAddress").click(() => {
    $.ajax({
        url: "PHP/address.php",
        type: "POST",
        dataType: "json",
        data: {
            address_latitude: $("#latitude").val(),
            address_longitude: $("#longitude").val(),
        },
        success: (result) => {
            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                $("#addressListRes").html(result["data"]["address"]["street"]);
            }
        },
        error: (jqXHR, textStatus, errorThrown) => {
            alert("No Data Found");
        },
    });
});
