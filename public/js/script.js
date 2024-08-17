/* Handling the interactivity of the search bar. 
    document.addEventListener('DOMContentLoaded', function() {...});
    The code inside this event listener will run once the DOM is fully loaded and parsed. 
    This ensures that all elements the script interacts with are available in the DOM.
*/

document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn'); /* The allButtons variable holds a NodeList of all elements on the page with the class .searchBtn.
                                                                    A NodeList is similar to an array, but it is not exactly the same.
                                                                    It contains a collection of DOM nodes (in this case, the buttons) that match the given selector.
                                                                 */

    const searchBar = document.querySelector('.searchBar');   /* This selects the element with the class .searchBar, 
                                                                which represents the search bar that will be shown or hidden. */

    const searchInput = document.getElementById('searchInput'); //selects the input element where the user will type their search query.

    const searchClose = document.getElementById('searchClose'); //selects the element that will be used to close the search bar
  


    /*
    This loop goes through each element in the allButtons NodeList
     and adds a click event listener to each.
    When any of these buttons are clicked, the search bar will be shown, 
    and the search input will be focused.
    */
    for (var i = 0; i < allButtons.length; i++) {
        /*
        The addEventListener method is used to attach a click event listener to the button.
        This means that whenever the button is clicked, the function inside
        the addEventListener will be executed.
        */
      allButtons[i].addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
      });
    }

    /* The loop goes through each button that can open the search bar,
     attaching a click event listener to each one. When any of these buttons are clicked,
      the search bar is made visible, the input field is focused for immediate typing,
       and an accessibility attribute is updated to reflect the search bar's state. */
  


    /* The close button is a unique element, so you don't need to repeat the action for multiple elements.
     You just add the click event listener to it once, outside the loop. 
    */
    searchClose.addEventListener('click', function() {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    });
  
  
  });