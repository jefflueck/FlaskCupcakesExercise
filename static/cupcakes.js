const BASE_URL = 'http://127.0.0.1:5000/api';

// This sets up our structure for what we are going to display
function displayCupcakeHTML(cupcake) {
  return `
  <div class="container">
  <div class="text-center">
    // ? Do not understand this part with data-cupcake-id
    <div data-cupcake-id=${cupcake.id}>
    <img src="${cupcake.image}">
      <p>
      ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
      </p>
      <button class="btn btn-danger btn-sm mb-2">Delete</button>
    </div>
    </div>
    </div>
  `;
}

// * This makes our async function to get all the cupcakes using axios thorough our API to the server and then we can use the data to display it
async function getCupcakes() {
  const response = await axios.get(`${BASE_URL}/cupcakes`);
  // loop through the response data of cupcakes
  for (let cupcake of response.data.cupcakes) {
    // Store the cupcake in a variable and call the function to display the cupcake
    let newCupcake = $(displayCupcakeHTML(cupcake));
    // Append the cupcake to the cupcakes div
    $('#cupcake-list').append(newCupcake);
  }
}

// Target the id of the form and then we can use the .on method to listen for the submit event
$('#cupcake-form').on('submit', async function (event) {
  // Prevent page refresh
  event.preventDefault();

  // Get the values from the form and store them in variables
  const flavor = $('#flavor').val();
  const size = $('#size').val();
  const rating = $('#rating').val();
  const image = $('#image').val();

  // Make a POST request to the server with a JSON object of a cupcake
  let addCupcake = {
    flavor: flavor,
    size: size,
    rating: rating,
    image: image,
  };

  // Make a POST request to the server with a JSON object of a cupcake
  const response = await axios.post(`${BASE_URL}/cupcakes`, addCupcake);
  // Que the new cupcake to the page but not rendered yet after the server response
  let addedCupcake = $(displayCupcakeHTML(response.data.cupcake));
  // Append the new cupcake to the page
  $('#cupcake-list').append(addedCupcake);
  // Clear the form
  $('#cupcake-form').trigger('reset');
});

// Target the list of cupcakes and then we can use the .on method to listen for the click event
$('#cupcake-list').on('click', '.btn-danger', async function () {
  // Get the cupcake id from the data attribute when we click the button and store that to the cupcakeId variable
  const cupcakeId = $(this).closest('[data-cupcake-id]').data('cupcake-id');
  // Make a DELETE request to the server with the cupcake id
  await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
  // Remove the cupcake from the page using the id of the cupcake using the .remove method
  $(this).closest('.container').remove();
});
// This is using JQuery's built in method to have the function getCupcakes() run when the index page loads using our render_template method from Flask
$(window).on('load', getCupcakes);
