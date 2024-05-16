document.querySelector('.hamburger').addEventListener('click', function () {
    this.classList.toggle('open');
    document.querySelector('.left').classList.toggle('active');
});

$('.nav-main a').on('click', function () {
    $('.left').removeClass('active');
});

$(document).ready(function () {
    $('#home').show();
});

document.querySelectorAll('.more').forEach(function (more) {
    more.style.display = 'none';
});

$('.read-more').click(function () {
    var more = $(this).prev();
    more.slideToggle(300);
    if ($(this).text() === 'Read more...') {
        $(this).text('Read less...');
    } else {
        $(this).text('Read more...');
    }
});

$('a').click(function (e) {
    e.preventDefault();
    var contentId = $(this).data('content');
    $('.content').hide();
    $('#' + contentId).show();
});


    $(document).ready(function(){
        var quotes = [
            "The poetry of the earth is never dead. - John Keats",
            "Nature always wears the colors of the spirit. - Ralph Waldo Emerson",
            "Study nature, love nature, stay close to nature. It will never fail you. - Frank Lloyd Wright",
            "Nature is not a place to visit. It is home. - Gary Snyder",
            "Look deep into nature, and then you will understand everything better. - Albert Einstein",
            "The clearest way into the Universe is through a forest wilderness. - John Muir",
            "In nature, nothing is perfect and everything is perfect. - Alice Walker",
            "The earth laughs in flowers. - Ralph Waldo Emerson",
            "To sit in the shade on a fine day and look upon verdure is the most perfect refreshment. - Jane Austen",
            "Nature does not hurry, yet everything is accomplished. - Lao Tzu",
            "Adopt the pace of nature: her secret is patience. - Ralph Waldo Emerson",
            "In every walk with nature, one receives far more than he seeks. - John Muir",
            "The mountains are calling and I must go. - John Muir",
            "Nature is the art of God. - Dante Alighieri",
            "To forget how to dig the earth and to tend the soil is to forget ourselves. - Mahatma Gandhi"
        ];
        var index = 0;

        function rollText() {
            $('#textRoller').fadeOut(400, function() {
                $(this).html(quotes[index]).fadeIn(400);
            });
            index = (index + 1) % quotes.length;
        }

        setInterval(rollText, 3000); // Change text every 5 seconds
    });

