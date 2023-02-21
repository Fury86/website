$("div .btn").click(function () {

    let element = $(this).attr("id");

    buttonAnimationClick(element);

    startAudio(element);

});


$("div .btn").hover(function () {

    let element = this.id;

    $("#" + element).attr('title', element);
});



$("*").keydown(function (event) {

    let element = event.key;

    let button = $("div ." + element).attr("id");

    buttonAnimationKey(element);

    startAudio(button);

})


function startAudio(element) {

    let audio = new Audio("sounds/" + element + ".mp3");
    audio.play();
}

function buttonAnimationKey(element) {

    $("div ." + element).addClass("pressed");

    setTimeout(function () {
        $("div ." + element).removeClass("pressed");
    }, 100);

}

function buttonAnimationClick(element) {

    $("div #" + element).addClass("pressed");

    setTimeout(function () {
        $("div #" + element).removeClass("pressed");
    }, 100);

}