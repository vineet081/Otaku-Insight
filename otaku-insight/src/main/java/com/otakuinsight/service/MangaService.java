package com.otakuinsight.service;

import com.otakuinsight.dto.MangaInfoDTO;
import com.otakuinsight.external.JikanClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class MangaService {

    @Autowired
    private JikanClient jikanClient;

    public MangaInfoDTO getMangaInfo(Long animeId) {

        if (animeId == null || animeId <= 0) {
            throw new IllegalArgumentException("Invalid anime ID");
        }

        // Step 1: Find related manga for this anime
        Map<String, Object> relatedManga = jikanClient.fetchRelatedManga(animeId);

        if (relatedManga == null) {
            throw new RuntimeException("No manga found for this anime");
        }

        // Step 2: Get manga ID and fetch full details
        Long mangaId = ((Number) relatedManga.get("mal_id")).longValue();
        Map<String, Object> mangaDetails = jikanClient.fetchMangaDetails(mangaId);

        if (mangaDetails == null) {
            throw new RuntimeException("Could not fetch manga details");
        }

        // Step 3: Build response
        return buildMangaInfoDTO(animeId, mangaDetails);
    }

    private MangaInfoDTO buildMangaInfoDTO(Long animeId,
                                           Map<String, Object> mangaDetails) {

        MangaInfoDTO dto = new MangaInfoDTO();

        // Manga title
        dto.setMangaTitle((String) mangaDetails.get("title"));

        // Total chapters
        if (mangaDetails.get("chapters") != null) {
            dto.setTotalMangaChapters(
                    ((Number) mangaDetails.get("chapters")).intValue());
        }

        // Total volumes
        if (mangaDetails.get("volumes") != null) {
            dto.setTotalMangaVolumes(
                    ((Number) mangaDetails.get("volumes")).intValue());
        }

        // Manga status
        dto.setMangaStatus((String) mangaDetails.get("status"));

        // Continue from chapter logic
        if (mangaDetails.get("chapters") != null) {
            Integer totalChapters =
                    ((Number) mangaDetails.get("chapters")).intValue();
            dto.setContinueFromChapter(
                    "Anime covers full manga - " + totalChapters + " chapters");
            dto.setNote("Fully adapted - no additional manga content");
        } else {
            dto.setContinueFromChapter("Manga still ongoing - check latest chapters");
            dto.setNote("Anime may not cover all available manga chapters");
        }

        return dto;
    }

}