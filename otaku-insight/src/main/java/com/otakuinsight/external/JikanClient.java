package com.otakuinsight.external;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.dto.EpisodeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.Map;

@Component
public class JikanClient {

    private static final String JIKAN_BASE_URL = "https://api.jikan.moe/v4";

    @Autowired
    private RestTemplate restTemplate;

    public AnimeDTO searchAnime(String animeName) {

        // Step 1: Build the URL
        String url = JIKAN_BASE_URL + "/anime?q=" + animeName + "&limit=1";

        // Step 2: Call Jikan API and get response
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        // Step 3: Extract the first anime from response
        if (response != null && response.containsKey("data")) {
            java.util.List<Map<String, Object>> dataList =
                    (java.util.List<Map<String, Object>>) response.get("data");

            if (!dataList.isEmpty()) {
                Map<String, Object> animeData = dataList.get(0);

                // Step 4: Convert to AnimeDTO
                return mapToAnimeDTO(animeData);
            }
        }

        return null; // No anime found
    }

    private AnimeDTO mapToAnimeDTO(Map<String, Object> animeData) {
        AnimeDTO dto = new AnimeDTO();

        // Extract each field from the Map and set it in DTO
        dto.setMalId(((Number) animeData.get("mal_id")).longValue());
        dto.setTitle((String) animeData.get("title"));

        if (animeData.get("episodes") != null) {
            dto.setEpisodes(((Number) animeData.get("episodes")).intValue());
        }

        if (animeData.get("score") != null) {
            dto.setScore(((Number) animeData.get("score")).doubleValue());
        }

        dto.setSynopsis((String) animeData.get("synopsis"));
        dto.setStatus((String) animeData.get("status"));

        // Extract image URL
        if (animeData.containsKey("images")) {
            Map<String, Object> images = (Map<String, Object>) animeData.get("images");
            if (images.containsKey("jpg")) {
                Map<String, Object> jpg = (Map<String, Object>) images.get("jpg");
                dto.setImageUrl((String) jpg.get("image_url"));
            }
        }

        // Extract year
        if (animeData.containsKey("aired")) {
            Map<String, Object> aired = (Map<String, Object>) animeData.get("aired");
            if (aired.containsKey("prop")) {
                Map<String, Object> prop = (Map<String, Object>) aired.get("prop");
                if (prop.containsKey("from")) {
                    Map<String, Object> from = (Map<String, Object>) prop.get("from");
                    if (from.get("year") != null) {
                        dto.setYear(((Number) from.get("year")).intValue());
                    }
                }
            }
        }

        return dto;
    }
    public List<EpisodeDTO> fetchAllEpisodes(Long animeId) {

        // This list will collect ALL episodes from ALL pages
        List<EpisodeDTO> allEpisodes = new ArrayList<>();

        int currentPage = 1;
        boolean hasNextPage = true;

        // Keep fetching pages until no more pages exist
        while (hasNextPage) {

            // Build URL with page number
            String url = JIKAN_BASE_URL + "/anime/" + animeId + "/episodes?page=" + currentPage;

            // Call Jikan API
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response == null) {
                break; // Something went wrong, stop loop
            }

            // Extract episode list from response
            List<Map<String, Object>> episodeDataList =
                    (List<Map<String, Object>>) response.get("data");

            if (episodeDataList == null || episodeDataList.isEmpty()) {
                break; // No episodes found, stop loop
            }

            // Convert each episode Map to EpisodeDTO
            for (Map<String, Object> episodeData : episodeDataList) {
                EpisodeDTO episode = mapToEpisodeDTO(episodeData);
                if (episode != null) {
                    allEpisodes.add(episode);
                }
            }

            // Check pagination - should we fetch next page?
            Map<String, Object> pagination =
                    (Map<String, Object>) response.get("pagination");

            if (pagination != null) {
                hasNextPage = (Boolean) pagination.get("has_next_page");
            } else {
                hasNextPage = false; // No pagination info, stop loop
            }

            // Move to next page
            currentPage++;

            // Small delay to respect Jikan API rate limits
            try {
                Thread.sleep(500); // Wait 0.5 seconds between requests
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        return allEpisodes;
    }

    private EpisodeDTO mapToEpisodeDTO(Map<String, Object> episodeData) {

        // Some episodes have no score - skip them
        if (episodeData.get("score") == null) {
            return null;
        }

        EpisodeDTO dto = new EpisodeDTO();

        // Set episode number
        if (episodeData.get("mal_id") != null) {
            dto.setEpisodeNumber(((Number) episodeData.get("mal_id")).intValue());
        }

        // Set title
        dto.setTitle((String) episodeData.get("title"));

        // Set rating
        dto.setRating(((Number) episodeData.get("score")).doubleValue());

        return dto;
    }
    public AnimeDTO searchAnimeById(Long animeId) {

        String url = JIKAN_BASE_URL + "/anime/" + animeId;

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("data")) {
            Map<String, Object> animeData =
                    (Map<String, Object>) response.get("data");
            return mapToAnimeDTO(animeData);
        }

        return null;
    }

}