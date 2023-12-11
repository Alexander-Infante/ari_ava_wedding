document.addEventListener("DOMContentLoaded", function() {
    const cloudFrontUrl = "https://diatlakdpp23f.cloudfront.net/";

    fetch(cloudFrontUrl)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");
            const files = xmlDoc.getElementsByTagName("Contents");

            for (let i = 0; i < files.length; i++) {
                const key = files[i].getElementsByTagName("Key")[0].childNodes[0].nodeValue;

                if (key.endsWith(".jpg") || key.endsWith(".png")) {
                    const container = document.createElement("div");
                    container.className = "image-container";

                    const img = document.createElement("img");
                    img.src = ''; // Initially, src is empty
                    img.dataset.src = cloudFrontUrl + key; // Actual image URL in data-src
                    img.className = 'lazy'; // Add a class to denote lazy loading
                    container.appendChild(img);

                    img.onclick = function() {
                        openModal(this.dataset.src);
                    };

                    document.getElementById("gallery").appendChild(container);
                } 
                // TODO PDF
                // else if (key.endsWith(".pdf")) {
                //     const link = document.createElement("a");
                //     link.href = cloudFrontUrl + key;
                //     link.textContent = "PDF: " + key;
                //     link.className = "pdf-link";
                //     document.getElementById("gallery").appendChild(link);
                // }
            }

            // Implement lazy loading
            let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

            if ("IntersectionObserver" in window) {
                let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            let lazyImage = entry.target;
                            lazyImage.src = lazyImage.dataset.src;
                            lazyImage.classList.remove("lazy");
                            lazyImageObserver.unobserve(lazyImage);
                        }
                    });
                });

                lazyImages.forEach(function(lazyImage) {
                    lazyImageObserver.observe(lazyImage);
                });
            } else {
                // Fallback for browsers without IntersectionObserver support
                lazyImages.forEach(function(lazyImage) {
                    lazyImage.src = lazyImage.dataset.src;
                });
            }
        })
        .catch(error => console.log("Error fetching and parsing data:", error));

    // Function to open modal
    function openModal(src) {
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("img01");

        modal.style.display = "block";
        modalImg.src = src;

        // Get the <span> element to close the modal
        const span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() { 
            modal.style.display = "none";
        }
    }
});
