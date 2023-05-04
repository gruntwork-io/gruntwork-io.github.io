$(function () {
  var rangePercent = $('[type="range"]').val();
  $('[type="range"]').on("change input", function () {
    rangePercent = $('[type="range"]').val();
    totalNumberOfReleasesIn2021 = 621;
    numberOfModulesIn2021 = 132;
    hourPerWork = 8;
    salaryRate = 57;
    calculatedUpdates = Math.floor(
      (Math.ceil((rangePercent / numberOfModulesIn2021) * 100) *
        totalNumberOfReleasesIn2021) /
        100
    );
    calculatedHours = calculatedUpdates * hourPerWork;
    calculatedSavedMoney = calculatedHours * salaryRate;
    $(".selected-slider-number").html(rangePercent);
    $(".selected-slider-number-mobile").html(rangePercent);
    $(".slider-number").css({
      left: (rangePercent * 100) / numberOfModulesIn2021 + "%",
    });
    $(".progress-bar").css({
      width: (rangePercent * 100) / numberOfModulesIn2021 + "%",
    });
    $(".updates").html(calculatedUpdates);
    $(".hours").html(calculatedHours);
    $(".money-saved").html("$" + calculatedSavedMoney);
  });
});
