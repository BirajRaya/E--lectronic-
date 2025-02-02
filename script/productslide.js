    var slideIndex = 0;
    var totalSlides = document.querySelectorAll('.product-card').length;
    var displaySlides = 4;

    function showSlides() {
        var i;
        var slides = document.getElementsByClassName("product-card");
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        for (i = slideIndex; i < slideIndex + displaySlides; i++) {
            var currentIndex = i;
            if(currentIndex >= totalSlides){
                currentIndex = currentIndex - totalSlides;
            }
            slides[currentIndex].style.display = "block";  
        }
    }

    function nextSlide() {
        slideIndex++;
        if(slideIndex > totalSlides - displaySlides){
            slideIndex = 0;
        }
        showSlides();
    }

    function prevSlide() {
        slideIndex--;
        if(slideIndex < 0){
            slideIndex = totalSlides - displaySlides;
        }
        showSlides();
    }

    showSlides();

    document.getElementById("next").addEventListener("click", nextSlide);
    document.getElementById("prev").addEventListener("click", prevSlide);
