window.onload = function() {
    // Get all the image links in the image selection
    var imgs = document.querySelectorAll('.img-select a');

    // Initialize the current image id
    var imgId = 1;

    // Loop through each image link
    for (var i = 0; i < imgs.length; i++) {
        // Add a click event listener to each image link
        imgs[i].addEventListener('click', function(event) {
            // Prevent the default behavior of the link
            event.preventDefault();

            // Update the current image id with the id from the clicked link
            imgId = this.dataset.id;

            // Display the selected image
            slideImage();
        });
    }

    // Function to display the selected image
    function slideImage() {
        // Get the width of the first image in the showcase
        var displayWidth = document.querySelector('.img-showcase img:first-child').clientWidth;

        // Move the showcase to the position of the selected image
        document.querySelector('.img-showcase').style.transform = 'translateX(' + (- (imgId - 1) * displayWidth) + 'px)';
    }

    // Add an event listener to adjust the slider when the window size changes
    window.addEventListener('resize', slideImage);
}