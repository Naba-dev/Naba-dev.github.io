$('document').ready( () => {
    loadProgressBar();
    $('form')[0].reset();

    $('#searchBox').on('focus',()=> {
        $('#searchBox').removeAttr("placeholder");
    });

    $('#searchBtn').on('click',(e) => {
        e.preventDefault();
        let searchText = $('#searchBox').val();
        if(searchText.length == 0) {
            $('#searchBox').addClass('border border-danger');
            $('#searchBox').attr('placeholder',"This text box cannot be left empty");
        }
        else {
        $('#searchBox').removeClass('border border-danger');
        getMovies(searchText);
        }
        // console.log(searchText);    
    });
});

function getMovies(sText) {
    axios.get('https://www.omdbapi.com/?apikey=b11ba554&s='+sText)
    .then( (response) => {
        console.log(response);

        if(response.data.Response == "False")
        {
            $('#movieList').html("<h5 style='color:red; margin-left:10px;'> Movie Not Found. Ensure movie name is correct </h5>");
        }
        else {
        let moviesList = response.data.Search;
        let output = '';
        $.each(moviesList, (index,movie) => {
            if(movie.Poster != "N/A") {
            output += ` 
                <div class="col-md-3 text-center" id="movie">
                    <img src = ${movie.Poster} onerror="this.src='./public/images/default.png'"/>
                    <h5 id="title"> ${movie.Title} (${movie.Year }) </h5>
                    <a onclick = movieSelected('${movie.imdbID}') href="#">
                    <div class="overlay">
                        <h3> Click For Details </h3>
                    </div>
                    </a>
                </div>`
            }
        });
        // console.log(output);
        $('#movieList').html(output);
    }
    })
    .catch( (err) => {
        //console.log(err);
    })
};

function movieSelected(id) {
    sessionStorage.setItem('movieID',id);
    window.location = 'movie.html'
    return false;
}

function getMovie() {
    loadProgressBar();
    let movieID = sessionStorage.getItem('movieID');
    axios.get('https://www.omdbapi.com/?apikey=b11ba554&i='+movieID)
    .then( (response) => {
      console.log(response);
      let movieDetails = response.data;
      let output =`
      <div class="row">
            <div class="col-md-3">
                <img src = ${movieDetails.Poster} class="thumbnail"/>
            </div>
            <div class="col-md-8" id="movie_details">
                <h1> ${movieDetails.Title} </h1>                
                <ul class="list-group">
                    <li class="list-group-item"> <strong> Genre: </strong> ${movieDetails.Genre} </li>
                    <li class="list-group-item"> <strong> Released: </strong> ${movieDetails.Released} </li>
                    <li class="list-group-item"> <strong> Rated: </strong> ${movieDetails.Rated} </li>
                    <li class="list-group-item"> <strong> Actors: </strong> ${movieDetails.Actors}</li>
                    <li class="list-group-item"> <strong> Director: </strong> ${movieDetails.Director}</li>
                    <li class="list-group-item"> <strong> Writer: </strong> ${movieDetails.Writer}</li>
                    <li class="list-group-item"> <strong> Year: </strong> ${movieDetails.Year} </li>
                    <li class="list-group-item"> <strong> IMDB Rating: </strong> ${movieDetails.imdbRating} </li>  
                </ul>
            </div>
      </div>
      <div class="container-fluid" id="movie_plot">
         <h2> Movie Plot </h2>
         <p> ${movieDetails.Plot} </p>
         <a class="btn btn-primary" href="https://www.imdb.com/title/${movieDetails.imdbID}"> View on IMDB </a> 
         <a class="btn btn-info" href="index.html"> Go Back </a>
      </div>
      `;
      $('#selectedMovie').html(output);

    })
    .catch( (err) => {
        console.log(err);
    })
};
