"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

async function getShowsByTerm(term) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`);
  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing"
    };
  });
}

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>`
    );
    $showsList.append($show);
  }
}

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number
  }));
}

function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty();
  for (let episode of episodes) {
    const $item = $(
      `<li>${episode.name} (season ${episode.season}, number ${episode.number})</li>`
    );
    $episodesList.append($item);
  }
  $episodesArea.show();
}

$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  const showId = $(evt.target).closest(".Show").data("show-id");
  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
});
