/* move to particular listing page */
function moveListing(){
    document.addEventListener("DOMContentLoaded", function() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.dataset.id;
            window.location.href = `/listing/${cardId}`;
        });
        });
    });    
}
moveListing();

let taxButton = document.querySelector('#taxButton');
taxButton.addEventListener('click', function() {
    let input = taxButton.querySelector('input');
    let taxprices = document.querySelectorAll('.taxprices');

    if (input.checked) {
        input.removeAttribute('checked');
        taxprices.forEach(taxprice => {
            taxprice.classList.add('hidden');
        });
    } else {
        taxprices.forEach(taxprice => {
            taxprice.classList.remove('hidden');
        });
        input.setAttribute('checked', 'checked');
    }
});

$(document).ready(function() {
    $('#category .categroies').on('click', function(e) {
        e.preventDefault();

        var category = $(this).data('category');
        console.log(category);

        $.ajax({
        url: '/listing/category/' + category,
        type: 'GET',
        success: function(data) {
            let listingContainer = document.getElementById('listingscontainer');
            let clutter = ''
            data.forEach(property=>{
                clutter = clutter + 
                `<div class="card" data-id="${property._id}">
                  <div class="cardimg rounded-lg h-[300px] bg-cover" style="background-image: url('${property.image.path}');"></div>
                  <p class="text-xl">${property.title}</p>
                  <p>$${property.price} /Night</p>
                  <i class="taxprices hidden"> + 18% GST = $${Math.floor( property.price * 1.18 )} /Night</i>
                </div>`;
            });
            listingContainer.innerHTML = clutter;
            moveListing();
        },
        error: function(error) {
            console.log(error);
        }
        });
    });
});

