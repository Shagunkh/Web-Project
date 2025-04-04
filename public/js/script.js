(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()


  document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;

   
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleButton.innerHTML = "☀️ Light Mode";
    }

    
    toggleButton.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

       
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleButton.innerHTML = "☀️ Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleButton.innerHTML = "🌙 Night Mode";
        }
    });

    
});


    document.addEventListener("DOMContentLoaded", function () {
        const searchInput = document.querySelector(".search-inp");
        const searchButton = document.querySelector(".search-btn");
        const listings = document.querySelectorAll(".listing-link");

       
        function searchListings() {
            const query = searchInput.value.trim().toLowerCase(); 

            listings.forEach(listing => {
                const title = listing.querySelector(".card-text b").textContent.toLowerCase(); 
                const category = listing.getAttribute("data-category").toLowerCase(); 

                
                if (title.includes(query) || category.includes(query)) {
                    listing.style.display = "block";
                } else {
                    listing.style.display = "none";
                }
            });
        }

      
        searchButton.addEventListener("click", function (event) {
            event.preventDefault(); 
            searchListings();
        });

       
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault(); 
                searchListings();
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function () {
        const cookieBanner = document.getElementById("cookie-banner");
        const acceptCookiesBtn = document.getElementById("accept-cookies");
        const rejectCookiesBtn = document.getElementById("reject-cookies");
    
      
        if (localStorage.getItem("cookieConsent")) {
            cookieBanner.style.display = "none";
        }
    
       
        acceptCookiesBtn.addEventListener("click", function () {
            localStorage.setItem("cookieConsent", "accepted");
            document.cookie = "userConsent=accepted; path=/; max-age=" + 60 * 60 * 24 * 365;
            cookieBanner.style.display = "none";
        });
    
       
        rejectCookiesBtn.addEventListener("click", function () {
            localStorage.setItem("cookieConsent", "rejected");
            document.cookie.split(";").forEach(function (cookie) {
                document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            cookieBanner.style.display = "none";
        });
    });
    



