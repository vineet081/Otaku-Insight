package com.otakuinsight.service;

import com.otakuinsight.dto.AnimeDTO;
import com.otakuinsight.dto.EpisodeAnalysisDTO;
import com.otakuinsight.dto.EpisodeDTO;
import com.otakuinsight.entity.AnimeEntity;
import com.otakuinsight.entity.EpisodeEntity;
import com.otakuinsight.external.JikanClient;
import com.otakuinsight.repository.AnimeRepository;
import com.otakuinsight.repository.EpisodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimeService {

    @Autowired
    private JikanClient jikanClient;

    @Autowired
    private AnimeRepository animeRepository;

    @Autowired
    private EpisodeRepository episodeRepository;

    // ==========================================
    // Search Anime - with DB caching
    // ==========================================

    public AnimeDTO searchAnime(String animeName) {

        if (animeName == null || animeName.trim().isEmpty()) {
            throw new IllegalArgumentException("Anime name cannot be empty");
        }

        // Check DB first
        Optional<AnimeEntity> cached = animeRepository
                .findByTitleContainingIgnoreCase(animeName);

        if (cached.isPresent()) {
            // Found in DB - return instantly!
            return mapEntityToDTO(cached.get());
        }

        // Not in DB - call Jikan API
        AnimeDTO anime = jikanClient.searchAnime(animeName);

        if (anime == null) {
            throw new RuntimeException("Anime not found: " + animeName);
        }

        // Save to DB for next time
        AnimeEntity entity = mapDTOToEntity(anime);
        animeRepository.save(entity);

        return anime;
    }

    // ==========================================
    // Episode Analysis - with DB caching
    // ==========================================

    public EpisodeAnalysisDTO analyzeEpisodes(Long animeId) {

        if (animeId == null || animeId <= 0) {
            throw new IllegalArgumentException("Invalid anime ID");
        }

        // Check if episodes already in DB
        Optional<AnimeEntity> animeEntity = animeRepository.findById(animeId);

        if (animeEntity.isPresent()) {
            List<EpisodeEntity> cachedEpisodes = episodeRepository
                    .findByAnime(animeEntity.get());

            if (!cachedEpisodes.isEmpty()) {
                // Found in DB - convert and analyze instantly!
                List<EpisodeDTO> episodeDTOs = cachedEpisodes.stream()
                        .map(this::mapEpisodeEntityToDTO)
                        .collect(Collectors.toList());
                return buildAnalysis(animeEntity.get().getTitle(), episodeDTOs);
            }
        }

        // Not in DB - fetch from Jikan API
        AnimeDTO animeInfo = jikanClient.searchAnimeById(animeId);
        List<EpisodeDTO> episodes = jikanClient.fetchAllEpisodes(animeId);

        if (episodes == null || episodes.isEmpty()) {
            throw new RuntimeException("No episodes found for anime ID: " + animeId);
        }

        // Save anime to DB if not exists
        AnimeEntity savedAnime;
        if (animeEntity.isPresent()) {
            savedAnime = animeEntity.get();
        } else {
            savedAnime = mapDTOToEntity(animeInfo);
            animeRepository.save(savedAnime);
        }

        // Save all episodes to DB
        for (EpisodeDTO ep : episodes) {
            EpisodeEntity episodeEntity = new EpisodeEntity();
            episodeEntity.setEpisodeNumber(ep.getEpisodeNumber());
            episodeEntity.setTitle(ep.getTitle());
            episodeEntity.setRating(ep.getRating());
            episodeEntity.setAnime(savedAnime);
            episodeRepository.save(episodeEntity);
        }

        return buildAnalysis(animeInfo != null ? animeInfo.getTitle() : "", episodes);
    }

    // ==========================================
    // Analysis Logic (same as before)
    // ==========================================

    private EpisodeAnalysisDTO buildAnalysis(String animeName,
                                             List<EpisodeDTO> episodes) {

        EpisodeAnalysisDTO analysis = new EpisodeAnalysisDTO();
        analysis.setAnimeName(animeName);
        analysis.setTotalEpisodes(episodes.size());

        episodes.forEach(ep -> ep.setRating(
                Math.round((ep.getRating() * 2) * 100.0) / 100.0
        ));

        double average = episodes.stream()
                .mapToDouble(EpisodeDTO::getRating)
                .average()
                .orElse(0.0);
        analysis.setAverageRating(Math.round(average * 100.0) / 100.0);

        EpisodeDTO highest = episodes.stream()
                .max(Comparator.comparingDouble(EpisodeDTO::getRating))
                .orElse(null);
        analysis.setHighestRatedEpisode(highest);

        EpisodeDTO lowest = episodes.stream()
                .min(Comparator.comparingDouble(EpisodeDTO::getRating))
                .orElse(null);
        analysis.setLowestRatedEpisode(lowest);

        long above9 = episodes.stream()
                .filter(episode -> episode.getRating() >= 9.0)
                .count();
        analysis.setEpisodesAbove9(above9);

        long above8 = episodes.stream()
                .filter(episode -> episode.getRating() >= 8.0)
                .count();
        analysis.setEpisodesAbove8(above8);

        return analysis;
    }

    // ==========================================
    // Mapping Methods
    // ==========================================

    private AnimeDTO mapEntityToDTO(AnimeEntity entity) {
        AnimeDTO dto = new AnimeDTO();
        dto.setMalId(entity.getMalId());
        dto.setTitle(entity.getTitle());
        dto.setEpisodes(entity.getEpisodes());
        dto.setScore(entity.getScore());
        dto.setStatus(entity.getStatus());
        dto.setImageUrl(entity.getImageUrl());
        dto.setYear(entity.getYear());
        dto.setSynopsis(entity.getSynopsis());
        return dto;
    }

    private AnimeEntity mapDTOToEntity(AnimeDTO dto) {
        AnimeEntity entity = new AnimeEntity();
        entity.setMalId(dto.getMalId());
        entity.setTitle(dto.getTitle());
        entity.setEpisodes(dto.getEpisodes());
        entity.setScore(dto.getScore());
        entity.setStatus(dto.getStatus());
        entity.setImageUrl(dto.getImageUrl());
        entity.setYear(dto.getYear());
        entity.setSynopsis(dto.getSynopsis());
        return entity;
    }

    private EpisodeDTO mapEpisodeEntityToDTO(EpisodeEntity entity) {
        EpisodeDTO dto = new EpisodeDTO();
        dto.setEpisodeNumber(entity.getEpisodeNumber());
        dto.setTitle(entity.getTitle());
        dto.setRating(entity.getRating());
        return dto;
    }

}
