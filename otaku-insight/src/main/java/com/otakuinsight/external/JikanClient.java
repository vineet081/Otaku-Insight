package com.otakuinsight.external;

import com.otakuinsight.dto.AnimeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

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

}